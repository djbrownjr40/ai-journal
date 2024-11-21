<template>
    <section class="landing-page">
        <div class="hero" ref="hero">
            <img v-for="(droplet, index) in droplets" :key="index" class="ink-droplet" :src="getRandomDroplet()"
                :style="getDropletStyle()" />
        </div>
        <div>
            <div v-if="showButtonSection" class="button-section">
                <button @click="goHome">ホーム</button>
                <button class="login-button" @click="goLogin">ログイン</button>
            </div>
        </div>
        <div>
            <h1 v-if="showText" class="reveal-text">
                {{ displayedText }}
                <span class="cursor" v-if="isTyping"></span>
            </h1>
            <section>
                <div class="hero-container">
                    <h2 class="hero-text glitch layers" data-text="ジャーナル" v-if="showHeroText"><span>ジャーナル</span></h2>
                </div>
            </section>
            <section>
                <div class="welcome-container">
                    <h3 class="welcome-text" data-text="ようこそ" v-if="showWelcomeText"><span>ようこそ、</span></h3>
                </div>
            </section>
            <section>
                <div class="goodbye-container">
                    <h3 class="goodbye-text" data-text="心地良いのジャーナルへ" v-if="showGoodbyeText">
                        <span class="highlighter"></span>
                        <span>心地良いのジャーナルへ</span>
                    </h3>
                </div>
            </section>
        </div>
        <div v-if="showNewUserButtonSection" class="new-user-button">
            <button @click="goNewUser">ジャーナリングの旅を始めよう</button>
        </div>

        <div class="overlay" ref="overlay"></div>
    </section>
</template>

<script>
import { gsap } from 'gsap';
import inkDroplet1 from '@/assets/inkDroplet1.svg';
import inkDroplet2 from '@/assets/inkDroplet2.svg';
import inkDroplet3 from '@/assets/inkDroplet3.svg';
import inkDroplet4 from '@/assets/inkDroplet4.svg';
import inkDroplet5 from '@/assets/inkDroplet5.svg';
import inkDroplet6 from '@/assets/inkDroplet6.svg';
//   import { text } from 'express';

export default {
    name: 'LandingPage',
    data() {
        return {
            droplets: Array(100).fill(0), // Create an array with 100 entries
            inkDroplets: [
                inkDroplet1,
                inkDroplet2,
                inkDroplet3,
                inkDroplet4,
                inkDroplet5,
                inkDroplet6,
            ],
            showNewUserButtonSection: false,
            showButtonSection: false,
            showText: false,
            showHeroText: false,
            showWelcomeText: false,
            showGoodbyeText: false,
            displayedText: '',
            isTyping: false,
            typingInProgress: false,
            newLineText: 'ジャーナル',
        };
    },
    methods: {
        goNewUser() {
            this.$router.push('./create-user')
        },
        goHome() {
            this.$router.push('./home');
        },
        goLogin() {
            this.$router.push('./login');
        },
        animateText() {
            if (this.typingInProgress) return;

            this.typingInProgress = true;
            const typingText = 'ai';
            this.isTyping = true;

            let index = 0;
            const interval = setInterval(() => {
                this.displayedText += typingText[index];
                index++;
                if (index === typingText.length) {
                    clearInterval(interval);
                    this.typingInProgress = false;

                    setTimeout(() => {
                        this.showHeroText = true;

                    }, 1000);
                    setTimeout(() => {
                        console.log("Showing welcome text");

                        this.showWelcomeText = true;
                    }, 2000);
                    setTimeout(() => {
                        console.log("Showing goodbye text");

                        this.showGoodbyeText = true;
                    }, 2300);
                    setTimeout(() => {
                        this.showButtonSection = true;
                    }, 2500);
                    setTimeout(() => {
                        console.log("Showing newuser text");

                        this.showNewUserButtonSection = true;
                    }, 2500);
                }
            }, 1000);
        },
        startJournaling() {
            this.$router.push('/journaling');
        },
        getRandomDroplet() {
            return this.inkDroplets[Math.floor(Math.random() * this.inkDroplets.length)];
        },
        getDropletStyle() {
            const size = Math.random() * (100 - 20) + 20;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            return {
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                position: 'absolute',
            };
        },
        animateDroplets() {
            const droplets = this.$refs.hero.children;
            Array.from(droplets).forEach((droplet, index) => {
                const duration = 1.2 - (index / droplets.length) * 0.8; // Ramp up speed
                const left = droplet.style.left; // Capture the initial left position
                const top = droplet.style.top; // Capture the initial top position
                gsap.fromTo(droplet, {
                    scale: 0.8,
                    opacity: 0,
                    // y: -30,
                }, {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: duration,
                    delay: index * 0.05, // Adjusted delay for faster start
                    ease: 'power2.out',
                    onComplete: () => {
                        // After animation completes, set them to fixed position
                        droplet.style.position = 'absolute'; // Ensure they stay in place
                        droplet.style.left = left;
                        droplet.style.top = top;
                        droplet.style.transform = ''; // Reset transform if necessary
                    }
                });
            });

            // Start fading to black immediately
            this.setBlackScreen();

            // Show text after all droplets are animated
            setTimeout(() => {
                this.showText = true; // Show text after droplet animation
            }, 3400); // Adjust timing as needed
        },
        setBlackScreen() {
            const overlay = this.$refs.overlay; // Use Vue ref for the overlay
            if (overlay) {
                overlay.style.opacity = '1'; // Start fading to black
                overlay.style.pointerEvents = 'all'; // Make overlay clickable

                // After the fade duration, show the text
                setTimeout(() => {
                    this.revealText();
                    if (!this.typingInProgress) {
                        this.animateText();
                    }
                }, 2000); // Match this to the overlay transition duration
            } else {
                console.error('Overlay element not found!');
            }
        },
        revealText() {
            this.showText = true; // Reveal the text on top of the black screen
            this.$nextTick(() => {
                const text = document.querySelector('.reveal-text');
                if (text) {
                    text.style.opacity = '1'; // Make text visible
                }
            });
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.animateDroplets();
        });
    },
};
</script>

<style scoped>
.new-user-button {
    position: absolute;
    top: 70%;
    /* Adjust position as needed */
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4;
    display: flex;
    gap: 500px;
    /* Space between buttons */

}

.new-user-button button {
    background: none;
    /* No background */
    color: #B91372;
    border: 2px solid rgba(255, 105, 180, 0.5);
    border-radius: 20px;
    /* Rounded corners for a modern look */
    padding: 10px 20px;
    /* Add padding for click area */
    font-size: 18px;
    /* Adjust font size */
    cursor: pointer;
    /* Pointer on hover */
    text-decoration: none;
    /* Optional: underline for a link effect */
    transition: all 0.3s ease;
    /* Smooth transition for hover effect */
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    /* Initial glow */
    animation: pulse 2s infinite;
    /* Add pulsing animation */
    font-family: "Hachi Maru Pop", cursive;
    font-weight: 800;
    font-style: normal;
}

.new-user-button button:hover {
    border-color: rgba(255, 105, 180, 1);
    /* Change border color on hover to solid pastel pink */
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
        /* Initial glow */
    }

    50% {
        box-shadow: 0 0 20px rgba(255, 105, 180, 1);
        /* Stronger pink glow */
    }

    100% {
        box-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
        /* Return to initial glow */
    }
}

.button-section {
    position: absolute;
    top: 15%;
    /* Adjust position as needed */
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4;
    display: flex;
    gap: 500px;
    /* Space between buttons */
}

.button-section button {
    background: none;
    /* No background */
    color: white;
    /* White text */
    border: none;
    /* No border */
    padding: 10px;
    /* Add some padding for click area */
    font-size: 24px;
    /* Adjust font size */
    cursor: pointer;
    /* Pointer on hover */
    text-decoration: none;
    /* Optional: underline for a link effect */
}

@keyframes glitch-hover {
    0% {
        text-shadow: 1px 1px #ff00ff, -1px -1px #00ffff;
    }

    20% {
        text-shadow: -1px -1px #ff00ff, 1px 1px #00ffff;
    }

    40% {
        text-shadow: 1px 1px #ff00ff, -1px -1px #00ffff;
    }

    60% {
        text-shadow: -1px -1px #ff00ff, 1px 1px #00ffff;
    }

    80% {
        text-shadow: 1px 1px #ff00ff, -1px -1px #00ffff;
    }

    100% {
        text-shadow: 0 0 #ff00ff, 0 0 #00ffff;
    }
}

.button-section button:hover {
    animation: glitch-hover 0.5s infinite;
    /* Apply glitch effect on hover */
}

.glitch {
    animation: glitch 1s forwards;
}

.login-button {
    background: none; /* No background */
    color: #B91372; /* Text color */
    border: 2px solid rgba(255, 105, 180, 0.5); /* Initial border */
    border-radius: 20px; /* Rounded corners */
    padding: 10px 20px; /* Padding for click area */
    font-size: 18px; /* Font size */
    cursor: pointer; /* Pointer on hover */
    text-decoration: none; /* No underline */
    transition: all 0.3s ease; /* Smooth transition */
    box-shadow: 0 0 10px rgba(255, 105, 180, 0.5); /* Initial glow */
    animation: pulse 2s infinite; /* Add pulsing animation */
    font-family: "Hachi Maru Pop", cursive; /* Font style */
    font-weight: 800; /* Font weight */
}

.login-button:hover {
    border-color: rgba(255, 105, 180, 1); /* Solid pastel pink on hover */
    box-shadow: 0 0 20px rgba(255, 105, 180, 1); /* Stronger pink glow on hover */
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
    }
    50% {
        box-shadow: 0 0 20px rgba(255, 105, 180, 1);
    }
    100% {
        box-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
    }
}

.reveal-text {
    color: white;
    font-size: 48px;
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 1s ease;
    z-index: 4;
    top: 20%;
    /* Set a specific value */
    font-family: 'Press Start 2P', regular;

}

.glitch-text {
    position: relative;
    display: inline-block;
    bottom: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4;
}

.glitch-text-top {
    position: absolute;
    left: 0;
    top: -10px;
    color: #ff00ff;
    transition: color 0.5s ease;
    z-index: 4;
}

.glitch-text-bottom {
    color: #00ffff;
    opacity: 0.5;
    transition: color 0.5s ease;
}

@keyframes glitch {
    0% {
        opacity: 1;
        transform: translate(0);
    }

    10% {
        opacity: 1;
        transform: translate(-2px, -2px);
    }

    20% {
        opacity: 0.8;
        transform: translate(2px, 0);
    }

    30% {
        opacity: 0.5;
        transform: translate(-1px, 1px);
    }

    40% {
        opacity: 1;
        transform: translate(1px, -1px);
    }

    50% {
        opacity: 1;
        transform: translate(0);
    }

    60% {
        opacity: 0.5;
        transform: translate(0, 2px);
    }

    70% {
        opacity: 1;
        transform: translate(-2px, 0);
    }

    80% {
        opacity: 0.8;
        transform: translate(2px, 1px);
    }

    100% {
        opacity: 1;
        transform: translate(0);
    }
}

.cursor {
    display: inline-block;
    width: 2px;
    height: 34px;
    background-color: white;
    animation: blink 0.7s step-end infinite;
}

@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}

.landing-page {
    text-align: center;
    padding: 50px;
    background: url('@/assets/parchment.jpg') no-repeat center center;
    background-size: cover;
    background-attachment: fixed;
    height: 100vh;
    position: relative;
    overflow: hidden;
}

.hero {
    position: absolute;
    /* Changed to absolute */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 1;
    /* Lower z-index to place behind text/buttons */
}

.ink-droplet {
    opacity: 0;
    z-index: 1;
    position: absolute;
    transition: none;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0;
    transition: opacity 8s ease;
    pointer-events: none;
    z-index: 2;
}


h2 {
    margin: 0;
}

a {
    color: #ccc;
}

section {
    padding: 20px;
}

.welcome-text {
    color: white;
    font-size: 48px;
    position: absolute;
    top: 0%;
    left: 30%;
    z-index: 4;

    top: 40%;
    /* Ensure this is below the AI text */

}

/* 
.highlighter {
    position: absolute;
    background: rgba(255, 105, 180, 0.6);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    clip-path: polygon(0 20%, 100% 10%, 100% 90%, 0 80%);
    z-index: 3;
    transition: opacity 0.3s ease;
} */

.goodbye-text {
    color: white;
    font-size: 48px;
    position: absolute;
    top: 10%;
    left: 40%;
    z-index: 4;

    top: 48%;
    /* Ensure this is below the AI text */

}

/* .goodbye-text.show {
    opacity: 1; 
} */

.hero-text {
    font-size: clamp(40px, 10vw, 100px);
    line-height: 1;
    display: inline-block;
    color: #fff;
    z-index: 4;
    letter-spacing: 10px;

    /* Bright things in dark environments usually cast that light, giving off a glow */
    filter: drop-shadow(0 1px 3px);
}

.demo {
    height: 100px;
    background: #fff;
}

.layers {
    position: relative;
}

.layers::before,
.layers::after {
    content: attr(data-text);
    position: absolute;
    width: 110%;
    z-index: -1;
}

.layers::before {
    top: 10px;
    left: 15px;
    color: #e0287d;
}

.layers::after {
    top: 5px;
    left: -10px;
    color: #1bc7fb;
}

.single-path {
    clip-path: polygon(0% 12%,
            53% 12%,
            53% 26%,
            25% 26%,
            25% 86%,
            31% 86%,
            31% 0%,
            53% 0%,
            53% 84%,
            92% 84%,
            92% 82%,
            70% 82%,
            70% 29%,
            78% 29%,
            78% 65%,
            69% 65%,
            69% 66%,
            77% 66%,
            77% 45%,
            85% 45%,
            85% 26%,
            97% 26%,
            97% 28%,
            84% 28%,
            84% 34%,
            54% 34%,
            54% 89%,
            30% 89%,
            30% 58%,
            83% 58%,
            83% 5%,
            68% 5%,
            68% 36%,
            62% 36%,
            62% 1%,
            12% 1%,
            12% 34%,
            60% 34%,
            60% 57%,
            98% 57%,
            98% 83%,
            1% 83%,
            1% 53%,
            91% 53%,
            91% 84%,
            8% 84%,
            8% 83%,
            4% 83%);
}

.paths {
    animation: paths 5s step-end infinite;
}

@keyframes paths {
    0% {
        clip-path: polygon(0% 43%,
                83% 43%,
                83% 22%,
                23% 22%,
                23% 24%,
                91% 24%,
                91% 26%,
                18% 26%,
                18% 83%,
                29% 83%,
                29% 17%,
                41% 17%,
                41% 39%,
                18% 39%,
                18% 82%,
                54% 82%,
                54% 88%,
                19% 88%,
                19% 4%,
                39% 4%,
                39% 14%,
                76% 14%,
                76% 52%,
                23% 52%,
                23% 35%,
                19% 35%,
                19% 8%,
                36% 8%,
                36% 31%,
                73% 31%,
                73% 16%,
                1% 16%,
                1% 56%,
                50% 56%,
                50% 8%);
    }

    5% {
        clip-path: polygon(0% 29%,
                44% 29%,
                44% 83%,
                94% 83%,
                94% 56%,
                11% 56%,
                11% 64%,
                94% 64%,
                94% 70%,
                88% 70%,
                88% 32%,
                18% 32%,
                18% 96%,
                10% 96%,
                10% 62%,
                9% 62%,
                9% 84%,
                68% 84%,
                68% 50%,
                52% 50%,
                52% 55%,
                35% 55%,
                35% 87%,
                25% 87%,
                25% 39%,
                15% 39%,
                15% 88%,
                52% 88%);
    }

    30% {
        clip-path: polygon(0% 53%,
                93% 53%,
                93% 62%,
                68% 62%,
                68% 37%,
                97% 37%,
                97% 89%,
                13% 89%,
                13% 45%,
                51% 45%,
                51% 88%,
                17% 88%,
                17% 54%,
                81% 54%,
                81% 75%,
                79% 75%,
                79% 76%,
                38% 76%,
                38% 28%,
                61% 28%,
                61% 12%,
                55% 12%,
                55% 62%,
                68% 62%,
                68% 51%,
                0% 51%,
                0% 92%,
                63% 92%,
                63% 4%,
                65% 4%);
    }

    45% {
        clip-path: polygon(0% 33%,
                2% 33%,
                2% 69%,
                58% 69%,
                58% 94%,
                55% 94%,
                55% 25%,
                33% 25%,
                33% 85%,
                16% 85%,
                16% 19%,
                5% 19%,
                5% 20%,
                79% 20%,
                79% 96%,
                93% 96%,
                93% 50%,
                5% 50%,
                5% 74%,
                55% 74%,
                55% 57%,
                96% 57%,
                96% 59%,
                87% 59%,
                87% 65%,
                82% 65%,
                82% 39%,
                63% 39%,
                63% 92%,
                4% 92%,
                4% 36%,
                24% 36%,
                24% 70%,
                1% 70%,
                1% 43%,
                15% 43%,
                15% 28%,
                23% 28%,
                23% 71%,
                90% 71%,
                90% 86%,
                97% 86%,
                97% 1%,
                60% 1%,
                60% 67%,
                71% 67%,
                71% 91%,
                17% 91%,
                17% 14%,
                39% 14%,
                39% 30%,
                58% 30%,
                58% 11%,
                52% 11%,
                52% 83%,
                68% 83%);
    }

    76% {
        clip-path: polygon(0% 26%,
                15% 26%,
                15% 73%,
                72% 73%,
                72% 70%,
                77% 70%,
                77% 75%,
                8% 75%,
                8% 42%,
                4% 42%,
                4% 61%,
                17% 61%,
                17% 12%,
                26% 12%,
                26% 63%,
                73% 63%,
                73% 43%,
                90% 43%,
                90% 67%,
                50% 67%,
                50% 41%,
                42% 41%,
                42% 46%,
                50% 46%,
                50% 84%,
                96% 84%,
                96% 78%,
                49% 78%,
                49% 25%,
                63% 25%,
                63% 14%);
    }

    90% {
        clip-path: polygon(0% 41%,
                13% 41%,
                13% 6%,
                87% 6%,
                87% 93%,
                10% 93%,
                10% 13%,
                89% 13%,
                89% 6%,
                3% 6%,
                3% 8%,
                16% 8%,
                16% 79%,
                0% 79%,
                0% 99%,
                92% 99%,
                92% 90%,
                5% 90%,
                5% 60%,
                0% 60%,
                0% 48%,
                89% 48%,
                89% 13%,
                80% 13%,
                80% 43%,
                95% 43%,
                95% 19%,
                80% 19%,
                80% 85%,
                38% 85%,
                38% 62%);
    }

    1%,
    7%,
    33%,
    47%,
    78%,
    93% {
        clip-path: none;
    }
}

.movement {
    /* Normally this position would be absolute & on the layers, set to relative here so we can see it on the div */
    position: relative;
    animation: movement 8s step-end infinite;
}

@keyframes movement {
    0% {
        top: 0px;
        left: -20px;
    }

    15% {
        top: 10px;
        left: 10px;
    }

    60% {
        top: 5px;
        left: -10px;
    }

    75% {
        top: -5px;
        left: 20px;
    }

    100% {
        top: 10px;
        left: 5px;
    }
}

.opacity {
    animation: opacity 5s step-end infinite;
}

@keyframes opacity {
    0% {
        opacity: 0.1;
    }

    5% {
        opacity: 0.7;
    }

    30% {
        opacity: 0.4;
    }

    45% {
        opacity: 0.6;
    }

    76% {
        opacity: 0.4;
    }

    90% {
        opacity: 0.8;
    }

    1%,
    7%,
    33%,
    47%,
    78%,
    93% {
        opacity: 0;
    }
}

.font {
    animation: font 7s step-end infinite;
}

@keyframes font {
    0% {
        font-weight: 100;
        color: #e0287d;
        filter: blur(3px);
    }

    20% {
        font-weight: 500;
        color: #fff;
        filter: blur(0);
    }

    50% {
        font-weight: 300;
        color: #1bc7fb;
        filter: blur(2px);
    }

    60% {
        font-weight: 700;
        color: #fff;
        filter: blur(0);
    }

    90% {
        font-weight: 500;
        color: #e0287d;
        filter: blur(6px);
    }
}

.glitch span {
    animation: paths 5s step-end infinite;
}

.glitch::before {
    animation: paths 5s step-end infinite, opacity 5s step-end infinite,
        font 8s step-end infinite, movement 10s step-end infinite;
}

.glitch::after {
    animation: paths 5s step-end infinite, opacity 5s step-end infinite,
        font 7s step-end infinite, movement 8s step-end infinite;
}

.hero-container {
    position: relative;
    padding: 200px 0;
    text-align: center;
}

.environment {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.5;
    filter: blur(5px);
    background-size: cover;
}
</style>