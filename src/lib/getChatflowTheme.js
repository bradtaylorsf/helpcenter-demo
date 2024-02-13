const getChatflowTheme = (selectedPersona) => {
    return {
        button: {
            backgroundColor: '#3B81F6',
            right: 20,
            bottom: 20,
            size: 'medium',
            iconColor: 'white',
            customIconSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
        },
        chatWindow: {
            showTitle: true, // show/hide the title bar
            title: 'AnswerAI Bot',
            titleAvatarSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
            welcomeMessage: `Hello ${selectedPersona.name}! How can I help you today?`,
            backgroundColor: '#ffffff',
            height: 700,
            width: 800,
            fontSize: 16,
            poweredByTextColor: '#FFFFFF',
            botMessage: {
                backgroundColor: '#f7f8ff',
                textColor: '#303235',
                showAvatar: true,
                avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png',
            },
            userMessage: {
                backgroundColor: '#3B81F6',
                textColor: '#ffffff',
                showAvatar: true,
                avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png',
            },
            textInput: {
                placeholder: 'Type your question',
                backgroundColor: '#ffffff',
                textColor: '#303235',
                sendButtonColor: '#3B81F6',
            },
        }
    };
}

export default getChatflowTheme;