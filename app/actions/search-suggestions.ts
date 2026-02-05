'use server'

// TODO: Implement ZOD!

export async function searchSuggestions(formData: FormData) {
  const { query } = Object.fromEntries(formData)
  console.log('in action!', query)
  // TODO: get suggestions from dictionary table!
}
