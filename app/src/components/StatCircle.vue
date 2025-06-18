<template lang="">
  <div>
    <svg class="stat-circle" width="150" viewBox="0 0 20 20">
      <circle class="bg" cx="10" cy="10" r="8"></circle>
      <circle
        class="progress"
        cx="10"
        cy="10"
        r="8"
        :data-percentage="percentage"
      ></circle>
      <text x="50%" y="55%">{{ percentage }}%</text>
    </svg>
  </div>
</template>
<script>
export default {
  props: { percentage: Number },
};
</script>
<style>
.stat-circle circle.bg {
  fill: none;
  stroke: #f1f1f1;
  stroke-width: 2;
}
.stat-circle circle.progress {
  fill: none;
  stroke: #2ecc71;
  stroke-width: 2;
  stroke-dasharray: 51 51;
  stroke-dashoffset: -51;
  stroke-linecap: round;
}
.stat-circle text {
  font-size: 3px;
  text-anchor: middle;
  fill: #555;
}
</style>
