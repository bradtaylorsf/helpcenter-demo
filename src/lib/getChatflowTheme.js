const getChatflowTheme = (selectedPersona) => {
    return {
        button: {
            backgroundColor: '#512E3C',
            right: 20,
            bottom: 20,
            size: 'medium',
            iconColor: 'white',
            customIconSrc: 'https://www.rippling.com/favicons/apple-touch-icon.png',
        },
        chatWindow: {
            showTitle: true, // show/hide the title bar
            title: 'AnswerAI : Rippling Bot',
            titleAvatarSrc: 'https://www.rippling.com/favicons/apple-touch-icon.png',
            welcomeMessage: `Hello ${selectedPersona.name}! How can I help you today?`,
            backgroundColor: '#ffffff',
            height: 700,
            width: 800,
            fontSize: 16,
            botMessage: {
                backgroundColor: '#f7f8ff',
                textColor: '#303235',
                showAvatar: true,
                avatarSrc: 'https://lastrev.com/images/favicon.ico',
            },
            userMessage: {
                backgroundColor: '#512E3C',
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