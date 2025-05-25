import { useState, useEffect, useRef } from 'react';
import produtoService from '../../services/produtoService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

const ListarProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [first, setFirst] = useState(0); 
  const size = 5;
  const toast = useRef(null);

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroDescricao, setFiltroDescricao] = useState('');
  const [filtroPrecoMin, setFiltroPrecoMin] = useState(null);
  const [filtroPrecoMax, setFiltroPrecoMax] = useState(null);
  const debounceTimer = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    buscar();
    
  }, [page]);

  useEffect(() => {
  }, [total]);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      buscar();
    }, 2000);
  }, [filtroNome, filtroDescricao, filtroPrecoMin, filtroPrecoMax]);

  const buscar = async () => {
    const resultado = await produtoService.listar({ 
      page, 
      size,
      nome: filtroNome,
      descricao: filtroDescricao,
      precoMin: filtroPrecoMin,
      precoMax: filtroPrecoMax
     });

    setProdutos(resultado.data.data);
    setTotal(resultado.data.total);
  };

  const excluir = async (id) => {
    confirmDialog({
      message: 'Deseja realmente excluir este produto?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: async () => {
        await produtoService.excluir(id);
        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Produto exluido com sucesso!', life: 3000 });
        buscar();
      }
    });
  };

  const editar = (id) => {
    navigate(`/editar/${id}`)
  };

  const acaoTemplate = (produto) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" className="p-button-sm p-button-secondary" onClick={() => editar(produto.id)}/>
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => excluir(produto.id)}/>
    </div>
  );

  return (
    <div className="p-4">
    <ConfirmDialog/>
    <Toast ref={toast}/>

    <div className="mb-3 p-fluid grid formgrid">
      <div className="field col-12 md:col-3">
        <label htmlFor="filtroNome">Nome</label>
        <InputText id="filtroNome" value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)}/>
      </div>

      <div className="field col-12 md:col-3">
        <label htmlFor="filtroDescricao">Descrição</label>
        <InputText id="filtroDescricao" value={filtroDescricao} onChange={(e) => setFiltroDescricao(e.target.value)}/>
      </div>

      <div className="field col-12 md:col-2">
        <label htmlFor="filtroPrecoMin">Preço Mínimo</label>
        <InputNumber id="filtroPrecoMin" value={filtroPrecoMin} onValueChange={(e) => setFiltroPrecoMin(e.value)}/>
      </div>

      <div className="field col-12 md:col-2">
        <label htmlFor="filtroPrecoMax">Preço Máximo</label>
        <InputNumber id="filtroPrecoMax" value={filtroPrecoMax} onValueChange={(e) => setFiltroPrecoMax(e.value)}/>
      </div>
    </div>
    <div className="flex overflow-hidden">
      <div className="flex-grow-1 flex align-items-center justify-content-center bg-primary font-bold m-2 px-5 py-3 border-round">
        <h2 className="flex-grow-1">Produtos</h2>
      </div>
      <div className="flex-grow-1 flex align-items-right justify-content-right bg-primary font-bold m-2 px-5 py-3 border-round container-button" >
        <div className="flex-grow-1 align-items-right justify-content-center h-4rem bg-primary font-bold border-round m-2 w-full">
          <Button label="Novo Produto" icon="pi pi-plus" className="p-button-success" onClick={() => navigate('/novo')}/>
        </div>
      </div>
    </div>
      <DataTable  value={produtos}
        paginator
        rows={size}
        totalRecords={total}
        lazy
        first={first}
        onPage={(e) => {
          setFirst(e.first);
          setPage(e.page + 1);
      }}>
        <Column field="nome" header="Nome"/>
        <Column field="preco" header="Preço" body={(row) => `R$ ${row.preco.toFixed(2)}`}/>
        <Column field="descricao" header="Descrição"/>
        <Column header="Ações" body={acaoTemplate} style={{ width: '140px', textAlign: 'right' }}/>
      </DataTable>
      
    </div>
  );
};

export default ListarProdutos;