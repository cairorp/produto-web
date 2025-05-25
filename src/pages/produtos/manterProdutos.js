import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import produtoService from '../../services/produtoService';

const ManterProduto = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState(null);
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEdicao, setIsEdicao] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEdicao(true);
      carregarProduto(id);
    }
  }, [id]);

  const carregarProduto = async (id) => {
    try {
      const res = await produtoService.buscarPorId(id);
      setNome(res.data.nome);
      setDescricao(res.data.descricao);
      setPreco(res.data.preco);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar produto.', life: 3000 });
    }
  };

  const validar = () => {
    const novosErros = {};

    if (!nome || nome.trim().length < 2) {
      novosErros.nome = 'Nome deve ter pelo menos 2 caracteres';
      toast.current.show({ severity: 'warn', summary: 'Validação', detail: novosErros.nome, life: 3000 });
    }

    if (nome && nome.trim().length > 50) {
      novosErros.nome = 'Nome deve ter no máximo 50 caracteres';
      toast.current.show({ severity: 'warn', summary: 'Validação', detail: novosErros.nome, life: 3000 });
    }

    if (preco === null || preco <= 0) {
      novosErros.preco = 'Preço deve ser maior que zero';
      toast.current.show({ severity: 'warn', summary: 'Validação', detail: novosErros.preco, life: 3000 });
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;

    try {
      if (isEdicao) {
        await produtoService.atualizar(id, { nome, descricao, preco });
        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Produto atualizado com sucesso!', life: 3000 });
      } else {
        await produtoService.criar({ nome, descricao, preco });
        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Produto cadastrado com sucesso!', life: 3000 });
      }
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar produto.', life: 3000 });
    }
  };

  const footer = (
    <div>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setShowConfirm(false)}/>
      <Button label="Confirmar" icon="pi pi-check" className="p-button-success" onClick={() => { setShowConfirm(false); salvar(); }}/>
    </div>
  );

  return (
    <div className="card p-fluid">
      <Toast ref={toast}/>
      <h2 className="mb-4">{isEdicao ? 'Editar Produto' : 'Novo Produto'}</h2>

      <div className="field mb-3">
        <label htmlFor="nome">Nome</label>
        <InputText id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required className={errors.nome ? 'p-invalid' : ''}/>
        {errors.nome && <small className="p-error">{errors.nome}</small>}
      </div>

      <div className="field mb-3">
        <label htmlFor="descricao">Descrição</label>
        <InputText id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)}/>
      </div>

      <div className="field mb-4">
        <label htmlFor="preco">Preço</label>
        <InputNumber id="preco" value={preco} onValueChange={(e) => setPreco(e.value)} mode="currency" currency="BRL" locale="pt-BR" className={errors.preco ? 'p-invalid' : ''}/>
        {errors.preco && <small className="p-error">{errors.preco}</small>}
      </div>

      <Button label="Salvar" icon="pi pi-check" onClick={() => setShowConfirm(true)} className="p-button-success"/>

      <Dialog header={isEdicao ? 'Confirmar Atualização' : 'Confirmar Cadastro'} visible={showConfirm} style={{ width: '350px' }} modal footer={footer} onHide={() => setShowConfirm(false)}>
        <p>{isEdicao ? 'Confirma a atualização do produto?' : 'Confirma o cadastro do produto?'}</p>
        <p><b>Produto: </b>{nome}</p>
        <p><b>Descrição: </b>{descricao}</p>
        <p><b>Valor: </b>{preco}</p>
      </Dialog>
    </div>
  );
};

export default ManterProduto;
