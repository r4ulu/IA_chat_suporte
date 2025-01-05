document.getElementById('send-button').addEventListener('click', enviarPergunta);
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();  // Impede o comportamento padrão (nova linha)
        enviarPergunta();
    }
});

function enviarPergunta() {
    const pergunta = document.getElementById('user-input').value;
    const cms = document.getElementById('cms-select').value; // Obter o CMS selecionado
    
    if (pergunta.trim() === '') {
        alert('Por favor, digite uma pergunta!');
        return;
    }

    // Exibir a pergunta no chat
    exibirMensagem(pergunta, 'user');

    // Mostrar o spinner de carregamento
    document.getElementById('loading-spinner').style.display = 'block';

    // Enviar a pergunta e o CMS para o servidor
    fetch('https://28f1-2804-14c-1ad-2319-7df8-7aad-686-2974.ngrok-free.app/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            question: pergunta,
            cms: cms
        })
    })
    .then(response => response.json())
    .then(data => {
        // Esconder o spinner de carregamento
        document.getElementById('loading-spinner').style.display = 'none';

        // Exibir a resposta do servidor no chat
        exibirMensagem(data.resposta, 'bot');
        
        // Limpar o campo de texto após o envio
        document.getElementById('user-input').value = '';
    })
    .catch(error => {
        // Esconder o spinner de carregamento em caso de erro
        document.getElementById('loading-spinner').style.display = 'none';
        console.error('Erro ao enviar a pergunta:', error);
    });
}

function exibirMensagem(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Rolagem automática
}
