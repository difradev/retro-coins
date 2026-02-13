'use server'

// TODO: Implement ZOD!

export async function searchSuggestions(formData: FormData) {
  const { query } = Object.fromEntries(formData)
  console.log('in action!', query)
  // TODO: get game and navigate to the page
}
