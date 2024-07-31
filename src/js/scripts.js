// URL da sua API
const apiUrl = 'http://localhost:8080/api/itens/'; // Ajuste conforme a URL da sua API

// Função para obter e exibir a lista de compras    
async function obterListaDeCompras() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Erro na requisição');
    const data = await response.json();

    // Limpar a lista existente
    const listaDeCompras = document.getElementById('lista-compras');
    listaDeCompras.innerHTML = '';

    // Adicionar os itens da lista ao DOM
    data.forEach(item => {
      const li = document.createElement('li');
      const span = document.createElement('span');

      span.innerHTML = `<a href='http://localhost:8080/api/itens/id/${item.id}'>${item.nome}</a> - <strong style='color:green;'> R$ ${item.preco.toFixed(2)}</strong> x ${item.quantidade}`;
      li.appendChild(span);

      // Criar e adicionar botão de remoção
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remover';
      removeButton.style.backgroundColor = 'red';
      removeButton.onclick = () => removerItem(item.id);
      li.appendChild(removeButton);

      listaDeCompras.appendChild(li);
    });

    // Atualizar o total
    atualizarTotal(data);
  } catch (error) {
    console.error('Erro ao obter a lista de compras:', error);
  }
}

// Função para atualizar o total
function atualizarTotal(items) {
  const total = items.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const totalElement = document.getElementById('total');
  totalElement.textContent = total.toFixed(2);
}

// Função para adicionar um item à lista
async function adicionarItem() {
  const itemInput = document.getElementById('item');
  const precoInput = document.getElementById('preco');
  const quantidadeInput = document.getElementById('quantidade');
  const descricaoInput = document.getElementById('descricao');

  const item = itemInput.value;
  const preco = parseFloat(precoInput.value);
  const quantidade = parseInt(quantidadeInput.value, 10);
  const descricao = descricaoInput.value;

  if (item && !isNaN(preco) && !isNaN(quantidade)) {
    try {
      // Adicionar o item via API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: item, descricao, preco, quantidade }),
      });
      if (!response.ok) throw new Error('Erro ao adicionar item');
      await obterListaDeCompras(); // Atualiza a lista após adicionar o item
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }

    // Limpar os campos de entrada
    itemInput.value = '';
    precoInput.value = '';
    quantidadeInput.value = 1;
  } else {
    alert('Por favor, preencha todos os campos corretamente.');
  }
}

// Função para remover um item da lista
async function removerItem(id) {
    try {
      // Remover o item via API
      const response = await fetch(`${apiUrl}id/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao remover item');
      await obterListaDeCompras(); // Atualiza a lista após remover o item
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  }

// Obter a lista de compras ao carregar a página
document.addEventListener('DOMContentLoaded', obterListaDeCompras);
