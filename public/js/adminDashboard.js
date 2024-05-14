const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Nutritional Preference', 'Membership status', 'Workout Preferences', 'Activity Levels', 'Fitness Goals', 'others'],
    datasets: [{
      label: '%',
      data: [12, 19, 30, 18, 2, 9],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});