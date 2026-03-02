import { Platform, Condition } from '@/app/generated/prisma/client'
import prisma from '../database/prisma'

export async function getAllPlatforms(): Promise<Platform[]> {
  return prisma.platform.findMany()
}

export async function getAllConditions(): Promise<Condition[]> {
  return prisma.condition.findMany()
}
