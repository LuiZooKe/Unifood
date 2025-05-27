import './login-cadastro.css'

function Cadastro() {
    return (
        <div className="flex items-center justify-center min-h-screen main">
            <div className="bg-[#172c3c] rounded-md p-8 shadow-xl max-w-md w-full mx-4">
                <h1 className="text-white text-3xl font-semibold mb-6 text-center">Login</h1>

                <label className="block text-gray-300 mb-2" htmlFor="email">
                Email
                </label>
                <input
                id="email"
                type="email"
                placeholder="Digite seu email"
                className="w-full p-3 mb-4 rounded border border-gray-500 focus:outline-none focus:border-blue-500"
                />

                <label className="block text-gray-300 mb-2" htmlFor="password">
                Senha
                </label>
                <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                className="w-full p-3 mb-6 rounded border border-gray-500 focus:outline-none focus:border-blue-500"
                />

                <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition-colors"
                >
                Entrar
                </button>
                <button
                onClick={() => navigate('/cadastro')}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition-colors"
                >
                Cadastro
                </button>
            </div>
        </div>
    );
}

export default Cadastro;
