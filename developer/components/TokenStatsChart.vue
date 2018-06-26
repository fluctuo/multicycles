<script>
import { Line, mixins } from 'vue-chartjs'

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ['chartData'],
  mounted () {
    this.renderChart({
      labels: this.chartData.map(d => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`
      }),
      datasets: [
        {
          label: 'Requests per day',
          backgroundColor: '#677fb7',
          data: this.chartData.map(d => d.hits),
          fill: false
        }
      ]
    }, {
      responsive: true, maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        xAxes: [{ gridLines: { display: false } }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            min: 0,
          }
        }]
      }
    })
  }
}
</script>
