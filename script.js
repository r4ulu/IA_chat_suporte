document.getElementById('send-button').addEventListener('click', enviarPergunta);
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();  // Impede o comportamento padrão (nova linha)
        enviarPergunta();
    }
});

async function enviarPergunta() {
    const pergunta = document.getElementById('user-input').value;
    const cms = document.getElementById('cms-select').value; // Obter o CMS selecionado
    
    if (pergunta.trim() === '') {
        // Adiciona animação de vibração se o campo estiver vazio
        document.getElementById('user-input').classList.add('vibrate');
        setTimeout(() => {
            document.getElementById('user-input').classList.remove('vibrate');
        }, 300);

        alert('Por favor, digite uma pergunta!');
        return;
    }

    // Exibir a pergunta no chat
    exibirMensagem(pergunta, 'user');

    // Limpar o campo de entrada
    document.getElementById('user-input').value = '';

    // Mostrar o spinner de carregamento
    document.getElementById('loading-spinner').style.display = 'block';

    // Adiciona animação de vibração no botão de envio
    document.getElementById('send-button').classList.add('vibrate');
    setTimeout(() => {
        document.getElementById('send-button').classList.remove('vibrate');
    }, 300);

    try {
        // Enviar a requisição para o servidor
        const response = await fetch('http://localhost:3000/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: pergunta, cms: cms })
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        // Processa a resposta
        const data = await response.json();
       // console.log('Resposta:', data);

        // Exibe a resposta do bot no chat
        exibirMensagem(data.resposta, 'bot');
        
    } catch (error) {
        console.error('Erro:', error);
    } finally {
        // Oculta o loading spinner após a requisição
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

function exibirMensagem(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender);
    messageElement.textContent = message;

    // Se a mensagem for do usuário, aplica a animação de fade-out após 3 segundos
    if (sender === 'user') {
        setTimeout(() => {
            messageElement.classList.add('fade-out');
        }, 3000); // Tempo para desaparecer a mensagem do usuário
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Rolagem automática
}
