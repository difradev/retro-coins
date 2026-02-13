'use server'

import { redirect, RedirectType } from 'next/navigation'

// TODO: Implement ZOD!

export async function searchSuggestions(formData: FormData) {
  const { query } = Object.fromEntries(formData)

  if (!query) {
    // Manage errors!
    console.error('No query provided!')
  }

  redirect(`games/${query}`, RedirectType.replace)
}
