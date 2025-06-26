import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dashboard from './Dashboard';
import { IMaskInput } from 'react-imask';

function CadastroFuncionario() {
  const [tipoUsuario] = useState(3);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf: '',
    data_nascimento: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    telefone: '',
    data_admissao: '',
    cargo: '',
    salario: '00,00'
  });

  const [erros, setErros] = useState([]);
  const [sucesso, setSucesso] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const bloquearInputManual = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novosErros = [];

    if (!formData.nome.trim()) novosErros.push('O nome é obrigatório.');
    if (!formData.email.trim()) novosErros.push('O email é obrigatório.');
    if (!formData.senha) novosErros.push('A senha é obrigatória.');
    if (formData.senha.length < 8) novosErros.push('A senha deve ter pelo menos 8 caracteres.');
    if (!formData.confirmarSenha) novosErros.push('A confirmação de senha é obrigatória.');
    if (formData.senha !== formData.confirmarSenha) novosErros.push('As senhas devem ser iguais.');
    if (!formData.data_nascimento) novosErros.push('Data de nascimento é obrigatória.');
    if (!formData.data_admissao) novosErros.push('Data de admissão é obrigatória.');

    function validarCPF(cpf) {
      cpf = cpf.replace(/\D/g, '');
      if (cpf.length !== 11 || /^(\\d)\1+$/.test(cpf)) return false;

      const calcularDigito = (base, fator) => {
        let soma = 0;
        for (let i = 0; i < base.length; i++) {
          soma += parseInt(base.charAt(i)) * (fator - i);
        }
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
      };

      const d1 = calcularDigito(cpf.slice(0, 9), 10);
      const d2 = calcularDigito(cpf.slice(0, 10), 11);

      return cpf[9] == d1 && cpf[10] == d2;
    }

    if (!validarCPF(formData.cpf)) {
      novosErros.push("CPF inválido.");
    }

    if (novosErros.length > 0) {
      setErros(novosErros);
      setSucesso('');
      return;
    }

    setErros([]);

    const salarioNumerico = parseFloat(
      formData.salario.replace(/\./g, '').replace(',', '.')
    );

    const formDataFormatado = {
      ...formData,
      cpf: formData.cpf.replace(/\D/g, ''),
      telefone: formData.telefone.replace(/\D/g, ''),
      salario: isNaN(salarioNumerico) ? 0 : salarioNumerico.toFixed(2),
      tipo_usuario: tipoUsuario
    };

    try {
      const response = await fetch('http://localhost/UNIFOOD/database/register_funcionario.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataFormatado)
      });

      const data = await response.json();

      if (data.success) {
        setSucesso('Cadastrado com sucesso!');
        setFormData({
          nome: '',
          email: '',
          senha: '',
          confirmarSenha: '',
          cpf: '',
          data_nascimento: '',
          logradouro: '',
          numero: '',
          bairro: '',
          cidade: '',
          telefone: '',
          data_admissao: '',
          cargo: '',
          salario: '00,00'
        });
      } else {
        setErros([data.message || 'Erro ao cadastrar.']);
        setSucesso('');
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setErros(['Erro na conexão com o servidor.']);
      setSucesso('');
    }
  };

  return (
    <Dashboard>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto bg-[#520000] text-white p-8 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <h1 className="text-3xl font-bold col-span-1 md:col-span-2 text-center mb-4">
          Cadastro Funcionário
        </h1>

        <Input label="Nome" name="nome" value={formData.nome} onChange={handleChange} />
        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
        <Input label="Senha" type="password" name="senha" value={formData.senha} onChange={handleChange} />
        <Input
          label="Confirmar Senha"
          type="password"
          name="confirmarSenha"
          value={formData.confirmarSenha}
          onChange={handleChange}
        />
        <Input label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} mask="000.000.000-00" />
        <Input
          label="Data de Nascimento"
          type="date"
          name="data_nascimento"
          value={formData.data_nascimento}
          onChange={handleChange}
          onKeyDown={bloquearInputManual}
          onPaste={bloquearInputManual}
        />
        <Input label="Logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} />
        <Input label="Número" name="numero" value={formData.numero} onChange={handleChange} />
        <Input label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} />
        <Input label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} />
        <Input label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} mask="(00) 00000-0000" />
        <Input
          label="Data de Admissão"
          type="date"
          name="data_admissao"
          value={formData.data_admissao}
          onChange={handleChange}
          onKeyDown={bloquearInputManual}
          onPaste={bloquearInputManual}
        />
        <div>
          <label className="block mb-1">Cargo</label>
          <select
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
            required
          >
            <option value="Caixa">Caixa</option>
            <option value="Atendente">Atendente</option>
            <option value="Cozinheira">Cozinheira</option>
          </select>
        </div>

        <Input
          label="Salário"
          name="salario"
          value={formData.salario}
          onChange={handleChange}
          mask={Number}
          scale={2}
          thousandsSeparator="."
          radix=","
          mapToRadix={["."]}
          normalizeZeros
          padFractionalZeros
        />

        {erros.length > 0 && (
          <ul className="col-span-1 md:col-span-2 text-red-400 list-disc pl-5">
            {erros.map((erro, i) => (
              <li key={i}>{erro}</li>
            ))}
          </ul>
        )}

        {sucesso && (
          <p className="col-span-1 md:col-span-2 text-green-400 font-bold text-center">{sucesso}</p>
        )}

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-green-600 hover:bg-blue-700 py-3 rounded text-white font-semibold transition"
        >
          Cadastrar
        </button>
      </form>
    </Dashboard>
  );
}

const Input = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  mask,
  ...rest
}) => (
  <div>
    <label htmlFor={name} className="block text-gray-200 mb-1">
      {label}
    </label>
    {mask ? (
      <IMaskInput
        id={name}
        name={name}
        value={value}
        mask={mask}
        onAccept={(value) => onChange({ target: { name, value } })}
        className="w-full p-2 rounded border border-gray-400 text-black"
        {...rest}
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-2 rounded border border-gray-400 text-black"
        {...rest}
      />
    )}
  </div>
);

Input.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  mask: PropTypes.any
};

export default CadastroFuncionario;
