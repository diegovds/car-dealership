import OpenAI from 'openai'
import { z } from 'zod'
import { env } from '../../../config/env.js'
import { searchFilterCars } from '../cars.repository.js'
import type { SearchFilters } from '../cars.schema.js'

const TOOL_NAME = 'buscar_carros'

const toolYearMax = new Date().getFullYear() + 1

const toolOptionalAno = z.coerce
  .number()
  .int()
  .min(1950)
  .max(toolYearMax)
  .optional()

const toolOptionalKm = z.coerce.number().int().min(0).optional()

const toolOptionalPrice = z.coerce.number().min(0).optional()

const toolArgsSchema = z.object({
  marca: z.string().trim().min(1).optional(),
  nome: z.string().trim().min(1).optional(),
  versao: z.string().trim().min(1).optional(),
  ano: toolOptionalAno,
  ano_min: toolOptionalAno,
  ano_max: toolOptionalAno,
  km_min: toolOptionalKm,
  km_max: toolOptionalKm,
  combustivel: z.string().trim().min(1).optional(),
  cambio: z.string().trim().min(1).optional(),
  preco_min: toolOptionalPrice,
  preco_max: toolOptionalPrice,
})

const BUSCAR_CARROS_TOOL = {
  type: 'function' as const,
  function: {
    name: TOOL_NAME,
    description:
      'Consulta o catálogo por critérios. Preencha tudo o que a pergunta deixar claro. `marca` = fabricante (BMW, Fiat). `nome` = modelo (Gol, T-Cross). `versao` = motor/trim (1.4, Comfortline). `ano` = ano-modelo exato (use só um: `ano` OU `ano_min`/`ano_max`, não misture). `ano_min`/`ano_max` = faixa de anos. `km_min`/`km_max` = quilometragem em km inteiros ("50 mil" → 50000). `combustivel` = tipo de combustível (Flex, Gasolina, Diesel, Híbrido). `cambio` = tipo de câmbio (Automático, Manual). `preco_min`/`preco_max` = faixa de preço em reais (ex.: "até 100 mil" → preco_max: 100000). Use {} só para pedidos genéricos (ex.: "mostre tudo").',
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        marca: {
          type: 'string',
          description:
            "Fabricante quanto citado, inclusive sozinho, (ex: 'tem bmw?' -> BMW)",
        },
        nome: {
          type: 'string',
          description: 'Modelo (ex.: Gol, T-Cross, 320i)',
        },
        versao: {
          type: 'string',
          description:
            'Versão ou motor quando citado (ex.: 1.4, 1.0 TSI, Comfortline)',
        },
        ano: {
          type: 'integer',
          description:
            'Ano-modelo exato quando citado um só ano (ex.: 2020). Não use junto com ano_min/ano_max.',
        },
        ano_min: {
          type: 'integer',
          description:
            "Limite inferior do ano (inclusive), ex.: 'a partir de 2019' → 2019",
        },
        ano_max: {
          type: 'integer',
          description:
            "Limite superior do ano (inclusive), ex.: 'até 2021' → 2021",
        },
        km_min: {
          type: 'integer',
          description:
            "Km mínimos em número inteiro (ex.: 'mais de 80 mil km' → 80000)",
        },
        km_max: {
          type: 'integer',
          description:
            "Km máximos em número inteiro (ex.: 'até 50 mil km' → 50000)",
        },
        combustivel: {
          type: 'string',
          description:
            "Tipo de combustível quando citado (ex.: 'flex', 'gasolina', 'diesel', 'híbrido')",
        },
        cambio: {
          type: 'string',
          description:
            "Tipo de câmbio/transmissão quando citado (ex.: 'automático', 'manual')",
        },
        preco_min: {
          type: 'number',
          description:
            "Preço mínimo em reais (ex.: 'acima de 100 mil' → 100000)",
        },
        preco_max: {
          type: 'number',
          description: "Preço máximo em reais (ex.: 'até 80 mil' → 80000)",
        },
      },
    },
  },
} satisfies OpenAI.ChatCompletionTool

function naturalReply(itemCount: number, filterCount: number): string {
  const char =
    filterCount === 1 ? 'essa característica' : 'essas características'

  if (itemCount === 0) {
    return 'Não encontrei nenhum veículo no nosso catálogo.'
  }

  if (itemCount === 1) {
    return `Encontrei 1 veículo com ${char}.`
  }

  return `Encontrei ${itemCount} veículos com ${char}.`
}

function toolJsonToFilters(raw: string): SearchFilters {
  try {
    const parsed = toolArgsSchema.safeParse(JSON.parse(raw) as unknown)

    if (!parsed.success) {
      return {}
    }

    const {
      marca,
      versao,
      nome,
      ano,
      ano_min: anoMin,
      ano_max: anoMax,
      km_min: kmMin,
      km_max: kmMax,
      combustivel,
      cambio,
      preco_min: precoMin,
      preco_max: precoMax,
    } = parsed.data

    return {
      ...(marca ? { brand: marca } : {}),
      ...(versao ? { version: versao } : {}),
      ...(nome ? { model: nome } : {}),
      ...(ano !== undefined ? { year: ano } : {}),
      ...(anoMin !== undefined ? { yearMin: anoMin } : {}),
      ...(anoMax !== undefined ? { yearMax: anoMax } : {}),
      ...(kmMin !== undefined ? { mileageMin: kmMin } : {}),
      ...(kmMax !== undefined ? { mileageMax: kmMax } : {}),
      ...(combustivel ? { fuel: combustivel } : {}),
      ...(cambio ? { transmission: cambio } : {}),
      ...(precoMin !== undefined ? { priceMin: precoMin } : {}),
      ...(precoMax !== undefined ? { priceMax: precoMax } : {}),
    }
  } catch {
    return {}
  }
}

export function createAiSearchAgent() {
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY })

  return async function run(userMessage: string, page: number = 1) {
    const completion = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0,
      messages: [
        {
          role: 'system',
          content:
            'Você é um assistente de catálogo de veículos em português. Sua ÚNICA tarefa é chamar a função buscar_carros extraindo filtros da mensagem do usuário. REGRAS OBRIGATÓRIAS: 1) SEMPRE preencha pelo menos um campo se a mensagem mencionar qualquer característica de carro. 2) `nome` = modelo do carro (Gol, Civic, Corolla, 911, HB20, Onix, etc). Se o usuário perguntar "tem gol?" → {"nome":"Gol"}. 3) `marca` = fabricante (BMW, Fiat, Volkswagen, Toyota, etc). 4) `versao` = motor ou trim (1.0 TSI, Comfortline, etc). 5) `ano` = ano exato; `ano_min`/`ano_max` = faixa de anos. 6) `km_min`/`km_max` = quilometragem em inteiros (50 mil → 50000). 7) `combustivel` = tipo de combustível (Flex, Gasolina, Diesel, Híbrido). 8) `cambio` = tipo de câmbio (Automático, Manual). 9) `preco_min`/`preco_max` = faixa de preço em reais (100 mil → 100000). 10) SOMENTE use {} vazio quando a mensagem pedir TUDO sem nenhum filtro (ex: "mostre todos", "lista tudo"). Na DÚVIDA, extraia o máximo de informação possível.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      tools: [BUSCAR_CARROS_TOOL],
      tool_choice: 'required',
    })

    const toolCalls = completion.choices[0]?.message.tool_calls ?? []

    const call = toolCalls.find(
      (c): c is Extract<(typeof toolCalls)[number], { type: 'function' }> =>
        c.type === 'function' && c.function.name === TOOL_NAME,
    )

    const filters = call
      ? toolJsonToFilters(call.function.arguments ?? '{}')
      : {}

    const perPage = 12

    if (Object.keys(filters).length === 0) {
      return {
        cars: [],
        reply:
          'Não consegui identificar filtros compatíveis com a busca. Tente descrever marca, modelo, ano, preço, combustível ou câmbio.',
        meta: { page, perPage, total: 0, totalPages: 0 },
      }
    }

    const { cars, total } = await searchFilterCars(filters, page, perPage)

    return {
      cars,
      reply: naturalReply(total, Object.keys(filters).length),
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    }
  }
}
