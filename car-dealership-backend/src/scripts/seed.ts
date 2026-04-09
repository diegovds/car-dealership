import bcrypt from 'bcrypt'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '../config/env'
import { cars } from '../db/schema/cars'
import { users } from '../db/schema/users'

const pool = new Pool({ connectionString: env.DATABASE_URL })
const db = drizzle(pool)

const SEED_USER = {
  name: 'John Doe',
  email: 'john@email.com',
  password: '123456',
  phone: '(11) 91234-5678',
}

const SEED_CARS = [
  // --- Populares / Entrada ---
  {
    brand: 'Volkswagen',
    model: 'Gol',
    version: '1.0 MPI',
    year: 2021,
    price: '58900.00',
    fuel: 'Flex',
    transmission: 'Manual',
    mileage: 32000,
  },
  {
    brand: 'Volkswagen',
    model: 'Polo',
    version: '1.0 TSI',
    year: 2023,
    price: '89900.00',
    fuel: 'Flex',
    transmission: 'Automático',
    mileage: 15000,
  },
  {
    brand: 'Chevrolet',
    model: 'Onix',
    version: '1.0 Turbo LTZ',
    year: 2023,
    price: '92500.00',
    fuel: 'Flex',
    transmission: 'Automático',
    mileage: 12000,
  },
  {
    brand: 'Chevrolet',
    model: 'Onix Plus',
    version: '1.0 Turbo Premier',
    year: 2022,
    price: '87000.00',
    fuel: 'Flex',
    transmission: 'Automático',
    mileage: 28000,
  },
  {
    brand: 'Fiat',
    model: 'Argo',
    version: '1.3 Drive',
    year: 2022,
    price: '72000.00',
    fuel: 'Flex',
    transmission: 'Manual',
    mileage: 35000,
  },
  {
    brand: 'Fiat',
    model: 'Cronos',
    version: '1.3 Drive',
    year: 2023,
    price: '82000.00',
    fuel: 'Flex',
    transmission: 'Automático',
    mileage: 18000,
  },
  {
    brand: 'Hyundai',
    model: 'HB20',
    version: '1.0 Comfort',
    year: 2022,
    price: '74500.00',
    fuel: 'Flex',
    transmission: 'Manual',
    mileage: 27000,
  },
  {
    brand: 'Renault',
    model: 'Kwid',
    version: '1.0 Intense',
    year: 2023,
    price: '62000.00',
    fuel: 'Flex',
    transmission: 'Manual',
    mileage: 9000,
  },

  // --- SUVs Compactos ---
  {
    brand: 'Volkswagen',
    model: 'T-Cross',
    version: '1.0 TSI Comfortline',
    year: 2023,
    price: '125000.00',
    fuel: 'Flex',
    transmission: 'Automático',
    mileage: 14000,
  },
  {
    brand: 'Jeep',
    model: 'Renegade',
    version: '1.3 Turbo Limited',
    year: 2023,
    price: '135000.00',
    fuel: 'Flex',
    transmission: 'Automático',
    mileage: 11000,
  },
  {
    brand: 'Hyundai',
    model: 'Creta',
    version: '2.0 Ultimate',
    year: 2022,
    price: '142000.00',
    fuel: 'Flex',
    transmission: 'Automático',
    mileage: 22000,
  },
  {
    brand: 'Fiat',
    model: 'Pulse',
    version: '1.0 Turbo Drive',
    year: 2023,
    price: '98000.00',
    fuel: 'Flex',
    transmission: 'Automático',
    mileage: 16000,
  },
  {
    brand: 'Chevrolet',
    model: 'Tracker',
    version: '1.2 Turbo Premier',
    year: 2023,
    price: '148000.00',
    fuel: 'Flex',
    transmission: 'Automático',
    mileage: 10000,
  },
  {
    brand: 'Toyota',
    model: 'Corolla Cross',
    version: '2.0 XRE',
    year: 2023,
    price: '165000.00',
    fuel: 'Flex',
    transmission: 'Automático',
    mileage: 8000,
  },

  // --- Sedãs Médios ---
  {
    brand: 'Toyota',
    model: 'Corolla',
    version: '2.0 XEi',
    year: 2022,
    price: '138000.00',
    fuel: 'Flex',
    transmission: 'Automático',
    mileage: 25000,
  },
  {
    brand: 'Honda',
    model: 'Civic',
    version: '2.0 EXL',
    year: 2023,
    price: '155000.00',
    fuel: 'Flex',
    transmission: 'Automático',
    mileage: 12000,
  },
  {
    brand: 'Chevrolet',
    model: 'Cruze',
    version: '1.4 Turbo LTZ',
    year: 2022,
    price: '128000.00',
    fuel: 'Flex',
    transmission: 'Automático',
    mileage: 30000,
  },

  // --- Picapes ---
  {
    brand: 'Fiat',
    model: 'Strada',
    version: '1.3 Freedom CD',
    year: 2023,
    price: '95000.00',
    fuel: 'Flex',
    transmission: 'Manual',
    mileage: 20000,
  },
  {
    brand: 'Toyota',
    model: 'Hilux',
    version: '2.8 SRX 4x4',
    year: 2022,
    price: '285000.00',
    fuel: 'Diesel',
    transmission: 'Automático',
    mileage: 45000,
  },
  {
    brand: 'Chevrolet',
    model: 'S10',
    version: '2.8 High Country 4x4',
    year: 2023,
    price: '275000.00',
    fuel: 'Diesel',
    transmission: 'Automático',
    mileage: 18000,
  },

  // --- Premium ---
  {
    brand: 'BMW',
    model: '320i',
    version: '2.0 Sport GP',
    year: 2022,
    price: '265000.00',
    fuel: 'Gasolina',
    transmission: 'Automático',
    mileage: 18000,
  },
  {
    brand: 'BMW',
    model: 'X3',
    version: '2.0 xDrive30e M Sport',
    year: 2023,
    price: '385000.00',
    fuel: 'Híbrido',
    transmission: 'Automático',
    mileage: 8000,
  },
  {
    brand: 'Mercedes-Benz',
    model: 'Classe C',
    version: 'C 200 Avantgarde',
    year: 2023,
    price: '310000.00',
    fuel: 'Gasolina',
    transmission: 'Automático',
    mileage: 12000,
  },
  {
    brand: 'Mercedes-Benz',
    model: 'GLC',
    version: '300 4MATIC',
    year: 2022,
    price: '395000.00',
    fuel: 'Gasolina',
    transmission: 'Automático',
    mileage: 15000,
  },
  {
    brand: 'Audi',
    model: 'A3',
    version: '2.0 TFSI Performance',
    year: 2023,
    price: '275000.00',
    fuel: 'Gasolina',
    transmission: 'Automático',
    mileage: 10000,
  },
  {
    brand: 'Audi',
    model: 'Q5',
    version: '2.0 TFSI S-line',
    year: 2022,
    price: '365000.00',
    fuel: 'Gasolina',
    transmission: 'Automático',
    mileage: 22000,
  },

  // --- Luxo ---
  {
    brand: 'Porsche',
    model: 'Cayenne',
    version: '3.0 V6',
    year: 2023,
    price: '620000.00',
    fuel: 'Gasolina',
    transmission: 'Automático',
    mileage: 5000,
  },
  {
    brand: 'BMW',
    model: 'X5',
    version: '3.0 xDrive40i M Sport',
    year: 2023,
    price: '580000.00',
    fuel: 'Gasolina',
    transmission: 'Automático',
    mileage: 7000,
  },
  {
    brand: 'Mercedes-Benz',
    model: 'GLE',
    version: '450 4MATIC AMG-Line',
    year: 2023,
    price: '650000.00',
    fuel: 'Gasolina',
    transmission: 'Automático',
    mileage: 6000,
  },
  {
    brand: 'Porsche',
    model: '911',
    version: '3.0 Carrera S',
    year: 2022,
    price: '950000.00',
    fuel: 'Gasolina',
    transmission: 'Automático',
    mileage: 3000,
  },
]

async function main() {
  console.log('🌱 Iniciando seed...')

  const hashedPassword = await bcrypt.hash(SEED_USER.password, 10)

  const [user] = await db
    .insert(users)
    .values({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hashedPassword,
      phone: SEED_USER.phone,
    })
    .returning({ id: users.id })

  console.log(
    `✅ Usuário criado: ${SEED_USER.email} (senha: ${SEED_USER.password})`,
  )

  await db.insert(cars).values(
    SEED_CARS.map((car) => ({
      ...car,
      userId: user.id,
    })),
  )

  console.log(`✅ ${SEED_CARS.length} carros inseridos`)

  await pool.end()
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erro no seed:', err)
  process.exit(1)
})
