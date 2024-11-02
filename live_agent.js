document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.querySelector('.start-btn');
    const tutorialButton = document.querySelector('.tutorial-btn');
    const soundButton = document.querySelector('.sound-btn');
    const volumeSlider = document.getElementById('volumeSlider');
    const chatBox = document.getElementById('chatBox');
    const chatBoxInner = chatBox.querySelector('.chat-box-inner');
    const cursor = document.getElementById('cursor');
    const fadeOverlay = document.getElementById('fadeOverlay');
    const background = document.querySelector('.background');
    const imageBox = document.getElementById('imageBox');
    const dialogImage = document.getElementById('dialogImage');
    const userInputBox = document.getElementById('userInputBox');
    const userInputField = document.getElementById('userInputField');
    const sendButton = document.getElementById('sendButton');
    const landingPage = document.getElementById('landingPage');
    const chatbotSection = document.getElementById('chatbotSection');
    const footer = document.querySelector('.footer_text');
    const tutorialPanel = document.getElementById('tutorialPanel');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close-btn');
    const skipButton = document.getElementById('skipButton');

    // Central image creation
    const centralImage = document.createElement('img');
    centralImage.src = 'asset/css/png/formiche-fighe.svg';
    centralImage.className = 'formiche-dodge';
    document.body.appendChild(centralImage);

    const menuAudio = new Audio('asset/css/kinked_menu_fancy.mp3');
    const gameAudio = new Audio('asset/css/kinked_game_(FANCY).mp3');
    let currentAudio = menuAudio;
    let isPlaying = false;

    menuAudio.loop = true;
    gameAudio.loop = true;


    //Transition Overlay
    function createTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'transition-overlay';
        document.body.appendChild(overlay);
        return overlay;
    }

    // Loading Function
    function createLoadingIndicator() {
        const loading = document.createElement('div');
        loading.className = 'loading-state';
        loading.innerHTML = `
        <div class="loading-container">
            <div class="loading-bar"></div>
            <div class="loading-text">ESTABLISHING NEURAL CONNECTION</div>
        </div>
    `;
        document.body.appendChild(loading);
        return loading;
    }



    // Particles Effects
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        opacity: 0.2;  // Reduced opacity
        image-rendering: pixelated;
    `;
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const particles = [];
    let mouseX = 0;
    let mouseY = 0;
    
    // Simplified color palette
    const retroColors = [
        '#90D64B',  // Main green
        '#52fc3b',   // Bright green
        '#8F292B'
    ];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth / 4;
        canvas.height = window.innerHeight / 4;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
    }
    
    function createParticles() {
        particles.length = 0;
        // Reduced number of particles
        for(let i = 0; i < 20; i++) {
            particles.push({
                x: Math.floor(Math.random() * canvas.width),
                y: Math.floor(Math.random() * canvas.height),
                size: 2, // Fixed smaller size
                speedX: (Math.random() > 0.5 ? 0.2 : -0.2), // Slower movement
                speedY: (Math.random() > 0.5 ? 0.2 : -0.2), // Slower movement
                color: retroColors[Math.floor(Math.random() * retroColors.length)],
                blinkRate: 0.02 // Reduced blink rate
            });
        }
    }
    
    function drawPixelatedSquare(x, y, size, color) {
        ctx.fillStyle = color;
        x = Math.floor(x);
        y = Math.floor(y);
        ctx.fillRect(x, y, size, size);
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            // Slower movement
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Screen wrap
            if(p.x < 0) p.x = canvas.width;
            if(p.x > canvas.width) p.x = 0;
            if(p.y < 0) p.y = canvas.height;
            if(p.y > canvas.height) p.y = 0;
            
            // Only draw if not blinking
            if(Math.random() > p.blinkRate) {
                drawPixelatedSquare(p.x, p.y, p.size, p.color);
            }
            
            // Simplified connections - fewer and more subtle
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if(dist < 15) { // Reduced connection distance
                    ctx.beginPath();
                    ctx.moveTo(Math.floor(p.x), Math.floor(p.y));
                    ctx.lineTo(Math.floor(p2.x), Math.floor(p2.y));
                    ctx.strokeStyle = `${p.color}22`; // More transparent connections
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
        
        // Subtle scanline effect
        for(let i = 0; i < canvas.height; i += 8) { // Increased spacing
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // More transparent
            ctx.fillRect(0, i, canvas.width, 1);
        }
        
        requestAnimationFrame(animate);
    }
    
    // Initialize
    resizeCanvas();
    createParticles();
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
    
    // Minimal mouse interaction
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / 4;
        mouseY = e.clientY / 4;
    });




    

    if (volumeSlider) {
        const initialVolume = 0.5;
        volumeSlider.value = initialVolume;
        menuAudio.volume = initialVolume;
        gameAudio.volume = initialVolume;
    }

    let inputCount = 0;
    let currentMessageIndex = 0;
    let isAnimating = false;
    let canClick = true;
    let lastClickTime = 0;
    const clickDelay = 1000;

    const messages = [
        "Bzz... Bzz..",
        "Bzz... Bzz..",
        "Now it's time for you to talk.",
        "How do you feel about your work?"
    ];



// Modify toggleAudio function
function toggleAudio() {
    if (!currentAudio) return;

    if (isPlaying) {
        currentAudio.pause();
        soundButton.classList.remove('playing');
        soundButton.textContent = 'Sound Off';
    } else {
        // Always use gameAudio if we're past the landing page
        if (!landingPage || landingPage.style.display === 'none') {
            currentAudio = gameAudio;
        }
        
        currentAudio.play().catch(e => {
            console.error('Playback failed:', e);
            setTimeout(() => {
                currentAudio.play().catch(e => console.error('Retry failed:', e));
            }, 100);
        });
        soundButton.classList.add('playing');
        soundButton.textContent = 'Sound On';
    }
    isPlaying = !isPlaying;
}

    function switchAudio(newAudio) {
        if (!newAudio || newAudio === currentAudio) return;

        const wasPlaying = isPlaying;
        const currentVolume = currentAudio.volume;
        
        const fadeOut = setInterval(() => {
            if (currentAudio.volume > 0.1) {
                currentAudio.volume -= 0.1;
            } else {
                clearInterval(fadeOut);
                currentAudio.pause();
                currentAudio.volume = currentVolume;
                
                currentAudio = newAudio;
                currentAudio.volume = 0;
                
                if (wasPlaying) {
                    currentAudio.play().catch(e => console.error('Audio switch failed:', e));
                    
                    const fadeIn = setInterval(() => {
                        if (currentAudio.volume < currentVolume - 0.1) {
                            currentAudio.volume += 0.1;
                        } else {
                            currentAudio.volume = currentVolume;
                            clearInterval(fadeIn);
                        }
                    }, 50);
                }
            }
        }, 50);
    }

  // First, import GSAP in your HTML
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

function handleDialogueTransition(messageElement, text) {
    // Create timeline for sequence
    const tl = gsap.timeline();
    
    // Fade in message with typewriter effect
    tl.from(messageElement, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
    });
    
    // Split text into characters for typewriter
    const chars = text.split("");
    let currentText = "";
    
    chars.forEach((char, index) => {
        tl.add(() => {
            currentText += char;
            messageElement.innerHTML = currentText + '<span class="cursor-blink">|</span>';
        }, index * 0.05);
    });
    
    // Add final shake effect
    tl.to(messageElement, {
        keyframes: [
            { x: -2 },
            { x: 2 },
            { x: -2 },
            { x: 0 }
        ],
        duration: 0.3,
        ease: "none"
    });
    
    return tl;
}

// Replace the typeWriter function with this:
function typeWriter(text, element, i, fnCallback) {
    const messageElement = document.createElement('div');
    element.appendChild(messageElement);
    
    handleDialogueTransition(messageElement, text).then(() => {
        if (typeof fnCallback === 'function') {
            setTimeout(fnCallback, 500);
        }
    });
}

    function fadeTransition(callback) {
        if (!chatBoxInner) return;
        
        chatBoxInner.style.transition = 'opacity 0.5s';
        chatBoxInner.style.opacity = '0';
        
        setTimeout(() => {
            chatBoxInner.innerHTML = '';
            chatBoxInner.style.opacity = '1';
            if (callback) callback();
        }, 500);
    }

    async function sendMessageToBackend(message) {
        try {
            const response = await fetch('http://localhost:5025/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  
                },
                body: JSON.stringify({ message: message }),
            });
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error communicating with backend:', error);
            return "Sorry, I couldn't process that.";
        }
    }

    function handleUserInput() {
        if (!userInputField || !chatBoxInner) return;
    
        centralImage.classList.add('visible');
    
        async function processInput() {
            const userInput = userInputField.value.trim();
            if (userInput) {
                const loadingIndicator = createLoadingIndicator();
                loadingIndicator.classList.add('visible');
    
                inputCount++;
                const userMessage = document.createElement('p');
                chatBoxInner.appendChild(userMessage);
                typeWriter(`You: ${userInput}`, userMessage, 0, async () => {
                    userInputField.value = '';
                    const aiResponse = await sendMessageToBackend(userInput);
                    loadingIndicator.classList.remove('visible');
                    setTimeout(() => loadingIndicator.remove(), 300);
                    
                    const aiMessage = document.createElement('p');
                    chatBoxInner.appendChild(aiMessage);
                    typeWriter(`Agent: ${aiResponse}`, aiMessage, 0, () => {
                        scrollChatToBottom();
                        if (inputCount >= 6) {
                            setTimeout(() => {
                                startFinalMessageTransition();
                            }, 2000);
                        }
                    });
                });
            }
        }
    
        userInputField.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                processInput();
            }
        });
    
        sendButton.addEventListener('click', processInput);
    }
    
    
    
    function handleInteraction(event) {
        if (isAnimating || currentMessageIndex >= messages.length) return;
        if (event.target.closest('#userInputBox')) return;
        
        const currentTime = new Date().getTime();
        if (currentTime - lastClickTime < clickDelay) {
            return;
        }
        lastClickTime = currentTime;
        
        isAnimating = true;
        canClick = false;
        
        fadeTransition(() => {
            const messageElement = document.createElement('div');
            chatBoxInner.appendChild(messageElement);
            typeWriter(messages[currentMessageIndex], messageElement, 0, function () {
                if (chatBox) chatBox.classList.add('shake');
                
                setTimeout(() => {
                    if (chatBox) chatBox.classList.remove('shake');

                    if (currentMessageIndex === 1 || currentMessageIndex === 3) {
                        if (imageBox && dialogImage) {
                            imageBox.style.display = 'block';
                            dialogImage.classList.add('fade-out');
                            
                            setTimeout(() => {
                                dialogImage.src = `asset/css/png/slide-dialogo${currentMessageIndex === 1 ? '0' : '3'}.jpeg`;
                                dialogImage.classList.remove('fade-out');
                                dialogImage.classList.add('fade-in');
                                
                                setTimeout(() => {
                                    dialogImage.classList.remove('fade-in');
                                }, 500);
                            }, 500);
                        }
                    }

                    currentMessageIndex++;
                    isAnimating = false;
                    canClick = true;

                    if (currentMessageIndex === messages.length) {
                        setTimeout(revealBackgroundAndPromptUser, 2000);
                    }
                }, 500);
            });
        });
    }

    function revealBackgroundAndPromptUser() {
        if (fadeOverlay) {
            fadeOverlay.style.opacity = '0';
            fadeOverlay.style.transition = 'opacity 1s ease-in-out';
        }
        
        if (background) {
            background.style.opacity = '0.8';
            background.style.transition = 'opacity 1s ease-in-out';
        }
        
        if (imageBox) {
            imageBox.style.opacity = '0';
            imageBox.style.transition = 'opacity 1s ease-in-out';
            setTimeout(() => {
                imageBox.style.display = 'none';
            }, 1000);
        }
        
        if (chatBox) {
            chatBox.style.transition = 'width 0.5s ease-in-out, opacity 1s ease-in-out';
            chatBox.style.width = '100%';
        }
        
        setTimeout(() => {
            if (chatBoxInner) chatBoxInner.innerHTML = '';
            if (userInputBox) {
                userInputBox.style.display = 'block';
                if (userInputField) userInputField.focus();
            }
            handleUserInput();
        }, 1500);
    }

    function startFinalMessageTransition() {
        if (!chatBox || !userInputBox) return;

        chatBox.style.transition = 'width 0.5s ease-in-out, opacity 2s';
        chatBox.style.width = '110%';
        chatBox.style.opacity = '0';
        userInputBox.style.transition = 'opacity 2s';
        userInputBox.style.opacity = '0';

        setTimeout(() => {
            chatBox.style.display = 'none';
            userInputBox.style.display = 'none';
            showFinalMessage();
        }, 2000);
    }

    function showFinalMessage() {
        const finalMessageBox = document.createElement('div');
        finalMessageBox.id = 'finalMessageBox';
        Object.assign(finalMessageBox.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontSize: '24px',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '20px',
            borderRadius: '10px',
            opacity: '0',
            transition: 'opacity 2s'
        });
        
        finalMessageBox.innerHTML = "The connection vanishes, leaving behind only the echo of Agent's words." +
        "<br><br>" +
        "How did the conversation make you feel? Has your opinion on these issues shifted?" +
        "<br><br>" +
        "You can share it at <a href=\"mailto:reincantamento@gmail.com\" style=\"color: #90D64B;\">reincantamento@gmail.com</a>." +
        "<br><br>" +
        "This was only the first incursion from FORMICAIO. More emissaries are on the move.";
        document.body.appendChild(finalMessageBox);

        requestAnimationFrame(() => {
            finalMessageBox.style.opacity = '1';
        });
    }

    function scrollChatToBottom() {
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

   function handleStartClick() {
    const transitionOverlay = createTransitionOverlay();
    transitionOverlay.classList.add('active');

    setTimeout(() => {
        landingPage.style.display = 'none';
        if (footer) {
            footer.style.display = 'none';
        }
        chatbotSection.style.display = 'block';
        currentAudio = gameAudio;
        
        resizeCanvas();
        createParticles();
        
        if (fadeOverlay) {
            fadeOverlay.style.background = 'none';
            fadeOverlay.style.backgroundColor = 'transparent';
        }

        setTimeout(() => {
            transitionOverlay.classList.remove('active');
            setTimeout(() => transitionOverlay.remove(), 500);
            
            if (currentMessageIndex === 0) {
                handleInteraction({ target: document.body });
            }
        }, 100);
    }, 500);
}

    if (soundButton) {
        soundButton.addEventListener('click', toggleAudio);
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            currentAudio.volume = volume;
        });
    }

    if (startButton) {
        startButton.addEventListener('click', handleStartClick);
    }

    if (tutorialButton) {
        tutorialButton.addEventListener('click', function() {
            tutorialPanel.style.display = 'block';
            overlay.style.display = 'block';
            if (isPlaying) {
                currentAudio.pause();
                soundButton.classList.remove('playing');
                soundButton.textContent = 'Sound Off';
                isPlaying = false;
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            tutorialPanel.style.display = 'none';
            overlay.style.display = 'none';
            if (!isPlaying) {
                currentAudio.play().catch(e => console.error('Playback failed:', e));
                soundButton.classList.add('playing');
                soundButton.textContent = 'Sound On';
                isPlaying = true;
            }
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function() {
            tutorialPanel.style.display = 'none';
            overlay.style.display = 'none';
            if (!isPlaying) {
                currentAudio.play().catch(e => console.error('Playback failed:', e));
                soundButton.classList.add('playing');
                soundButton.textContent = 'Sound On';
                isPlaying = true;
            }
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && tutorialPanel.style.display === 'block') {
            tutorialPanel.style.display = 'none';
            overlay.style.display = 'none';
            if (!isPlaying) {
                currentAudio.play().catch(e => console.error('Audio switch failed:', e));
                soundButton.classList.add('playing');
                soundButton.textContent = 'Sound On';
                isPlaying = true;
            }
        }
        if (event.key === 'Enter' && !event.target.closest('#userInputBox') && canClick) {
            handleInteraction(event);
        }
    });

    document.addEventListener('click', function(event) {
        if (canClick) handleInteraction(event);
    });
});