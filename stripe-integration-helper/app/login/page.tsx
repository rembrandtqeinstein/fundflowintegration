import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const hasError = params.error !== undefined

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-white">Fund Flows Integration Guide</h1>
          <p className="text-slate-400 text-sm">Enter the password to continue</p>
        </div>

        <form
          action={async (formData: FormData) => {
            'use server'
            const password = formData.get('password') as string
            if (password === 'diagonal-graph') {
              const cookieStore = await cookies()
              cookieStore.set('ffi_session', 'authenticated', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
              })
              redirect('/')
            } else {
              redirect('/login?error=1')
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              autoFocus
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {hasError && (
              <p className="text-red-400 text-sm">Incorrect password. Try again.</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Continue
          </button>
        </form>
      </div>
    </main>
  )
}
