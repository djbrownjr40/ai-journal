<template>
  <header class="background-image">
    <div class="overlay">
      <div class="content">

        <!-- New Sign-Up Section -->
        <section class="signup-section" v-if="isSignupVisible">
          <button class="close-button" @click="closeSignupSection">ｘ</button>
          <div class="signup-content">
            <h2>今すぐ無料プロフィールを作成しましょう!</h2>
            <p>私たちのジャーナリングサービスに参加して、あなたの物語を始めましょう。簡単にサインアップして、すぐに利用を開始できます。</p>
            <router-link to="/create-user" class="signup-button">無料でサインアップ</router-link>
          </div>
        </section>

        <div class="journal-image">
          <img src="@/assets/journal1.jpg" alt="journal">
        </div>
        
        <!-- New Custom Section -->
        <section class="custom-section">
          <div class="custom-image">
            <i class="fa-solid fa-pen-nib"></i>          
          </div>
          <div class="custom-text">
            <p class="custom-text-ai">AI駆動のアシスタントがガイドし、インスパイアする、他にはないジャーナリング体験を発見してください</p>
            <router-link to="/create-user" class="signup-button">無料でサインアップ</router-link>
          </div>
        </section>

        <!-- Features Section -->
        <div class="features-section">
          <div class="feature" v-for="(feature, index) in features" :key="index">
            <img :src="feature.image" :alt="feature.title" class="feature-image">
            <div class="feature-text">
              <h2>{{ feature.title }}</h2>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
export default defineComponent ({
  name: 'HomePage',
  setup() {
    const isSignupVisible: Ref<boolean> = ref(true); // Default to true if you want to show it initially

    const closeSignupSection = () => {
      isSignupVisible.value = false; // Set to false to hide the section
    };

    const features = ref([
      {
        image: require('@/assets/feature1.jpg'),
        title: 'パーソナライズされたAIライティングプロンプト',
        description: '初心者にも最適な日本語のライティングサポートを提供します。',
      },
      {
        image: require('@/assets/feature2.jpg'),
        title: '日本語初心者に最適!',
        description: '初心者にも最適な日本語のライティングサポートを提供します。',
      },
      {
        image: require('@/assets/feature3.jpg'),
        title: '安全でプライベートなエントリー',
        description:  'あなたのジャーナルは完全に守られ、他の誰にも見られることはありません。',
      },
    ]);

    return {
      isSignupVisible,
      closeSignupSection,
      features
    };
  },
});

</script>


<style scoped>

.header {
  position: relative; /* Change to relative for proper positioning */
  width: 100%;
  height: 65vh; /* Set height to match the banner */
}

.background-image {
  position: absolute; /* Make it absolute within the header */
  top: 20vh;
  left: 0;
  width: 100%;
  height: 100%; /* Full height of the header */
  background: url('@/assets/home2.jpg') no-repeat center center;
  background-size: cover;
}

.overlay {
  position: absolute; /* Keep it absolute */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* Full height of the header */
  background: rgba(255, 255, 255, 0.6);
}

.content {
  position: relative; /* Keep it relative for stacking */
  z-index: 2;
  text-align: center;
  color: #3a3a3a;
  max-width: 100%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  /* Adjust margin if necessary to line up with the bottom of the banner */
}

.custom-section {
  display: flex;
  flex-direction: column; /* Stack items vertically */
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically */
  padding: 20px;
  background-color: #f8f8f8; /* Light background color for contrast */
  margin: 20px 0; /* Space above and below the section */
  border-radius: 10px; /* Rounded corners for the section */
  background-image: url('@/assets/texture.png'); /* Path to your texture image */
  background-repeat: repeat; /* Repeat the texture */
  background-size: cover; /* Cover the entire element */
  background-position: center; /* Center the texture */
}

.custom-image {
  text-align: center;
  margin-bottom: 15px; /* Space between icon and text */
}

.custom-image i {
  font-size: 4em; /* Much larger icon size */
  color: #ff877d; /* Optional: Adjust icon color if needed */
}

.custom-text {
  text-align: center;
  padding: 0 20px; /* Space between image and text */
}

.custom-text p {
  font-size: 1.5em; /* Larger text size */
  margin: 0;
  line-height: 1.4; /* Increase line height for readability */
  padding-bottom: 10px;
  color: #333; /* Darker color for better readability */
}

.journal-image {
  position: relative; /* Required for absolute positioning of text */
  text-align: center; /* Center-aligns text horizontally */
  background: rgba(255, 255, 255, 0.4);
}

.journal-image img {
  width: 100%; /* Adjust to fit container */
  height: auto; /* Maintain aspect ratio */
  display: block; /* Ensure block display */
  margin: 0 auto; /* Center image */
}

.main-title {
  position: absolute;
  top: 15%; /* Adjust as needed to position correctly */
  left: 50%;
  transform: translate(-50%, -50%); /* Center the title */
  font-size: 3em; /* Large text size */
  color: #fff; /* White text for contrast */
  z-index: 1; /* Ensure text is above the image */
  margin: 0;
  padding: 0;
  font-family: 'Noto Sans JP', sans-serif; /* Optional: Japanese-friendly font */
}

.highlight {
  color: #ff00ff; /* Red color for the character "愛" */
}

.bold-text {
  font-weight: bold; /* Make the text bold */
}

.welcome-message {
  position: absolute;
  top: 25%; /* Position below the title */
  left: 50%;
  transform: translateX(-50%); /* Center the message */
  font-size: 1.5em; /* Slightly smaller than the title */
  color: #fff; /* White text for contrast */
  z-index: 1; /* Ensure text is above the image */
  margin: 0;
  padding: 0;
  font-family: 'Noto Sans JP', sans-serif; /* Optional: Japanese-friendly font */
}

.background-image {
  position: absolute;
  left: 0;
  width: 100%;
  /* height: 100vh; */
  height: 65vh;

  background: url('@/assets/home2.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  /* height: 100%; */
  height: 65vh;
  background: rgba(255, 255, 255, 0.6);
}

.content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #3a3a3a;
  max-width: 100%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  height: 85vh;

}

.features-section {
  display: flex;
  flex-wrap: wrap; /* Allows wrapping on smaller screens */
  margin: 0 -10px; /* Negative margin to counteract column padding */
}

/* Style each feature to be one third of the container's width */
.feature {
  flex: 1 1 calc(33.333% - 20px); /* Adjust to fit three columns with spacing */
  box-sizing: border-box; /* Includes padding and border in element's total width and height */
  margin: 10px; /* Space between columns */
  padding: 10px; /* Padding inside each feature */
  text-align: center;
  padding-left: 30px;
  padding-right: 30px;

}

/* Style for images within features */
.feature img {
  width: 100%; /* Make image take full width of its container */
  height: auto; /* Maintain aspect ratio */
  border-radius: 10px; /* Optional: rounded corners for images */
}

/* Style for text below each image */
.feature-text {
  font-size: 1em;
  margin-top: 10px;
}

.feature-text h2 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.feature-text p {
  font-size: 1em;
  margin: 0;
}

.cta-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1.1em;
  color: #fff;
  background-color: #00ffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #00ffff;
}

.signup-section {
  background-color: #A9E5BB;
  padding: 20px;
  border-top: 2px solid #d9e5d6;
  margin-bottom: 20px;
  text-align: center;
  position: relative; /* Relative positioning for the close button */
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  color: #ff00ff;
  cursor: pointer;
}

.close-button:hover {
  color: #ff0000; /* Change color on hover if desired */
}

.signup-section h2 {
  font-size: 2em;
  margin-bottom: 15px;
}

.signup-section p {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.signup-button {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1.2em;
  font-weight: bold;
  color: #ff0000;
  background-color: #00ffff;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.signup-button:hover {
  background-color: #00ffff;
}
</style>