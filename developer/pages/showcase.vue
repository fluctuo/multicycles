<template>
  <div>
    <div class="titi">
      <b-container>
        <h1 class="display-3">Made with Open-API</h1>
        <h2>
          Some incredible products build with the vehicles share API. <br/>
          Implemented in a breeze.
        </h2>
      </b-container>
    </div>

    <b-container class="mt-5">
      <b-row align-h="center">
        <b-col align-self="center">
          <h3>Bike Hunt</h3>
          <p>
            Find shared bikes nearby with voice on Google Assistant and Alexa.<br>
            Twitter: <a href="https://twitter.com/bikehuntapp">@bikehuntapp</a> <br>
            Try it on:

            <a href="https://goo.gl/k9yfGw"><img src="alexa.png" alt="Alexa badge"></a>
            <a href="https://goo.gl/bhWHdd"><img src="google-assistant.png" alt="Google Assistant"></a>
          </p>
        </b-col>
        <b-col cols="12" sm="6">
          <b-img fluid src="~/assets/showcase-bikehunt.jpg"/>
        </b-col>
      </b-row>
      <b-row align-h="center" class="mt-5">
        <b-col cols="12" sm="6" order="2" order-sm="1">
          <b-img src="~/assets/showcase-multicycles.png" alt="" />
        </b-col>
        <b-col cols="12" sm="6" order="1" order-sm="2" align-self="center">
          <h3>Multicycles.org</h3>
          <p>
            Web app for all free-floating vehicles.<br>
            Working worldwide.<br>
            <a href="https://multicycles.org">https://multicycles.org</a>
          </p>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<style lang="scss">
@import '~/scss/app.scss';

.titi {
  background-image: url('~/assets/home-background-bike.jpg');
  background-size: cover;
  background-position: center;

  color: $light;

  padding: 50px 0;
}
</style>
