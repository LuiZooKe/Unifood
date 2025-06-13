import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dashboard from './Dashboard';
import { IMaskInput } from 'react-imask';

function CadastroFornecedor() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: null,
    cnpj: null,
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    telefone: '',
    mostrarCPF: false,
    mostrarCNPJ: false
  });

  const [erros, setErros] = useState([]);
  const [sucesso, setSucesso] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novosErros = [];

    if (!formData.nome.trim()) novosErros.push('O nome é obrigatório.');

    if (!formData.mostrarCPF && !formData.mostrarCNPJ) {
      novosErros.push('Marque CPF ou CNPJ.');
    }

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

    function validarCNPJ(cnpj) {
      cnpj = cnpj.replace(/\D/g, '');
      return cnpj.length === 14;
    }
    if (formData.mostrarCPF && (!formData.cpf || !formData.cpf.trim())) {
      novosErros.push('O CPF é obrigatório.');
    } else if (formData.mostrarCPF && !validarCPF(formData.cpf)) {
      novosErros.push('CPF inválido.');
    }

    if (formData.mostrarCNPJ && (!formData.cnpj || !formData.cnpj.trim())) {
      novosErros.push('O CNPJ é obrigatório.');
    } else if (formData.mostrarCNPJ && !validarCNPJ(formData.cnpj)) {
      novosErros.push('CNPJ inválido (deve conter 14 dígitos).');
    }

    if (novosErros.length > 0) {
      setErros(novosErros);
      setSucesso('');
      return;
    }

    setErros([]);

    const formDataFormatado = {
      nome: formData.nome.trim(),
      email: formData.email.trim(),
      cpf: formData.mostrarCPF ? formData.cpf.replace(/\D/g, '') : null,
      cnpj: formData.mostrarCNPJ ? formData.cnpj.replace(/\D/g, '') : null,
      logradouro: formData.logradouro.trim(),
      numero: formData.numero.trim(),
      bairro: formData.bairro.trim(),
      cidade: formData.cidade.trim(),
      telefone: formData.telefone ? formData.telefone.replace(/\D/g, '') : null
    };

    try {
      const response = await fetch('http://localhost/UNIFOOD/database/register-fornecedor.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataFormatado)
      });

      const data = await response.json();

      if (data.success) {
        setSucesso('Fornecedor cadastrado com sucesso!');
        setFormData({
          nome: '',
          email: '',
          cpf: null,
          cnpj: null,
          logradouro: '',
          numero: '',
          bairro: '',
          cidade: '',
          telefone: '',
          mostrarCPF: false,
          mostrarCNPJ: false
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
          Cadastro de Fornecedor
        </h1>

        <Input label="Nome" name="nome" value={formData.nome} onChange={handleChange} />
        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />

        {/* Checkboxes para CPF e CNPJ */}
        <div className="col-span-1 md:col-span-2 flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.mostrarCPF}
              onChange={() => {
                if (!formData.mostrarCPF) {
                  setFormData((prev) => ({
                    ...prev,
                    mostrarCPF: true,
                    mostrarCNPJ: false,
                    cpf: prev.cpf ?? '',
                    cnpj: null
                  }));
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    mostrarCPF: false,
                    cpf: null
                  }));
                }
              }}
            />
            <span>Usar CPF</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.mostrarCNPJ}
              onChange={() => {
                if (!formData.mostrarCNPJ) {
                  setFormData((prev) => ({
                    ...prev,
                    mostrarCNPJ: true,
                    mostrarCPF: false,
                    cnpj: prev.cnpj ?? '',
                    cpf: null
                  }));
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    mostrarCNPJ: false,
                    cnpj: null
                  }));
                }
              }}
            />
            <span>Usar CNPJ</span>
          </label>
        </div>

        {/* Campos condicionais de CPF e CNPJ */}
        {formData.mostrarCPF && (
          <Input
            label="CPF"
            name="cpf"
            value={formData.cpf ?? ''}
            onChange={handleChange}
            mask="000.000.000-00"
          />
        )}
        {formData.mostrarCNPJ && (
          <Input
            label="CNPJ"
            name="cnpj"
            value={formData.cnpj ?? ''}
            onChange={handleChange}
            mask="00.000.000/0000-00"
          />
        )}

        <Input label="Logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} />
        <Input label="Número" name="numero" value={formData.numero} onChange={handleChange} />
        <Input label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} />
        <Input label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} />
        <Input label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} mask="(00) 00000-0000" />

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
          Cadastrar Fornecedor
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]).isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  mask: PropTypes.any
};

export default CadastroFornecedor;
