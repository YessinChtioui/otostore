import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Le téléphone est requis'),
  governorate: z.string().min(2, 'Le gouvernorat est requis'),
  city: z.string().min(2, 'La ville est requise'),
  address: z.string().min(5, 'L\'adresse complète est requise'),
  postalCode: z.string().min(4, 'Le code postal est requis'),
  notes: z.string().optional(),
})

export const addressSchema = z.object({
  governorate: z.string().min(2, 'Le gouvernorat est requis'),
  city: z.string().min(2, 'La ville est requise'),
  address: z.string().min(5, 'L\'adresse complète est requise'),
  postalCode: z.string().min(4, 'Le code postal est requis'),
  isDefault: z.boolean().default(false),
})

export const productSchema = z.object({
  name: z.object({
    fr: z.string().min(2),
    ar: z.string().min(2),
    en: z.string().min(2),
  }),
  slug: z.string().min(2),
  description: z.object({
    fr: z.string().min(10),
    ar: z.string().min(10),
    en: z.string().min(10),
  }),
  price: z.number().min(0),
  comparePrice: z.number().nullable().optional(),
  stock: z.number().min(0),
  categoryId: z.string().min(1),
  images: z.array(z.string()).min(1),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
})
