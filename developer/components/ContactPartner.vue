<template>
  <div class="contact mt-5">
    <b-container>
      <b-row align="center">
        <b-col>
          <h3>Hands in hands, at the service of users</h3>
          <p>Interested in knowing how to integrate your service into Multicyles API?</p>
          <p>
            <b-button
              variant="outline-light"
              class="ml-2"
              href="mailto:contact@multicycles.org?subject=[PARTNER]"
            >contact@multicycles.org</b-button>
          </p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="scss">
@import '~/scss/app.scss';

.contact {
  background-color: map-get($theme-colors, 'primary');
  padding: 80px 0;
  color: $light;
}
</style>
