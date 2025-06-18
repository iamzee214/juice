<template>
  <div class="container">
    <div class="progress progress-striped">
      <div
        class="progress-bar"
        :style="{ width: progressWidth, backgroundColor: progressColor }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    completion: {
      type: Number,
      required: true,
      validator(value) {
        return value >= 0 && value <= 100;
      },
    },
  },
  computed: {
    progressWidth() {
      return this.completion + "%";
    },
    progressColor() {
      if (this.completion < 50) {
        return "#F9BCCA"; // Light color for less than 50%
      } else if (this.completion < 85) {
        return "#EF476F"; // Middle color for 50% to 85%
      } else {
        return "#ee303c"; // Dark color for more than 85%
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
}

.progress {
  padding: 6px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.25),
    0 1px rgba(255, 255, 255, 0.08);
}

.progress-bar {
  height: 18px;
  border-radius: 4px;
  transition: 0.4s linear;
  transition-property: width, background-color;
}

.progress-striped .progress-bar {
  animation: progressAnimationStrike 6s;
}

@keyframes progressAnimationStrike {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>
