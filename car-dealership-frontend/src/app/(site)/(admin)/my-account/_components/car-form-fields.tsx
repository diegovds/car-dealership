import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatBRL, formatKm, parseBRL, parseKm } from '@/lib/currency'
import { FUEL_OPTIONS, TRANSMISSION_OPTIONS } from '@/lib/car-options'
import type { Control, FieldValues, Path } from 'react-hook-form'

interface CarFormFieldsProps<T extends FieldValues> {
  control: Control<T>
}

// Carrega os mesmos campos para CarFormValues e UpdateCarFormValues (partial)
export function CarFormFields<T extends FieldValues>({
  control,
}: CarFormFieldsProps<T>) {
  const f = (name: string) => name as unknown as Path<T>

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name={f('brand')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Volkswagen" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('model')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Gol" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={f('version')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Versão</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 1.6 MSI Comfortline" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name={f('year')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ano *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="2020"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('price')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço *</FormLabel>
              <FormControl>
                <Input
                  placeholder="R$ 0,00"
                  value={formatBRL(field.value ?? '')}
                  onChange={(e) => field.onChange(parseBRL(e.target.value))}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name={f('fuel')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Combustível</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FUEL_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('transmission')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Câmbio</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TRANSMISSION_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={f('mileage')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quilometragem</FormLabel>
            <FormControl>
              <Input
                placeholder="0 km"
                value={formatKm(field.value)}
                onChange={(e) => field.onChange(parseKm(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && field.value !== undefined) {
                    const input = e.currentTarget
                    if (input.selectionStart === input.selectionEnd) {
                      e.preventDefault()
                      const s = String(field.value)
                      field.onChange(
                        s.length <= 1
                          ? undefined
                          : parseInt(s.slice(0, -1), 10),
                      )
                    }
                  }
                }}
                onBlur={field.onBlur}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={f('imageUrl')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL da imagem</FormLabel>
            <FormControl>
              <Input placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
