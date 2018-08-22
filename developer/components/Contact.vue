<template>
  <div class="contact mt-5">
      <b-container>
        <b-row>
          <b-col md="6" offset-md="6">
            <h3>We are here for you</h3>
            <p>
              For any questions about Open-API, multicycles, integration, usage or just want to chat?
            </p>
            <b-button variant="outline-light" class="ml-2" href="mailto:contact@multicycles.org">Contact us</b-button>

          </b-col>
        </b-row>
      </b-container>
  </div>
</template>

<style lang="scss">
@import '~/scss/app.scss';

.contact {
  background-image: url('~/assets/contact-background.jpg');
  background-size: cover;
  background-position: center;

  padding: 80px 0;
  color: #fff;
}
</style>
