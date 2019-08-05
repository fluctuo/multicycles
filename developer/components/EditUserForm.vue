<template>
  <b-form class="pt-3" @submit="onSubmit">
    <b-form-group id="companyInputGroup">
      <b-form-checkbox
        id="companyInput"
        v-model="form.company"
        switch
        v-bind="{disabled: isDisabled('company')}"
      >This is a company (corporate) account</b-form-checkbox>
    </b-form-group>

    <b-form-group id="fullnameInputGroup" label="Fullname:" label-for="fullnameInput">
      <b-form-input
        id="fullnameInput"
        v-model="form.name"
        type="text"
        placeholder="Enter fullname"
        :state="$v.form.name.$dirty && !$v.form.name.required ? !$v.form.name.$error : null"
      />
      <div class="invalid-feedback">Please provide a valid fullname.</div>
    </b-form-group>

    <b-form-group
      id="organizationInputGroup"
      label="Company name:"
      label-for="organizationInput"
      v-if="form.company"
    >
      <b-form-input
        id="organizationInput"
        v-model="form.organization"
        type="text"
        placeholder="Enter organization"
        :state="$v.form.organization.$dirty && !$v.form.organization.required ? !$v.form.organization.$error : null"
      />
      <div class="invalid-feedback">Please provide a valid company name.</div>
    </b-form-group>

    <b-form-group id="address1InputGroup" label="Street address:" label-for="address1Input">
      <b-form-input
        id="address1Input"
        v-model="form.address1"
        type="text"
        placeholder="Street address"
        :state="$v.form.address1.$dirty && !$v.form.address1.required ? !$v.form.address1.$error : null"
      />
      <div class="invalid-feedback">Please provide a valid address.</div>
    </b-form-group>

    <b-form-group id="address1InputGroup" label="Street address 2:" label-for="address1Input">
      <b-form-input
        id="address1Input"
        v-model="form.address2"
        type="text"
        placeholder="Street address 2"
      />
    </b-form-group>

    <b-row>
      <b-col>
        <b-form-group id="zipCodeInputGroup" label="Zip:" label-for="zipCodeInput">
          <b-form-input
            id="zipCodeInput"
            v-model="form.zipCode"
            type="text"
            placeholder="Enter postal code"
            :state="$v.form.zipCode.$dirty && !$v.form.zipCode.required ? !$v.form.zipCode.$error : null"
          />
          <div class="invalid-feedback">Please provide a valid zip.</div>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group id="cityInputGroup" label="City:" label-for="cityInput">
          <b-form-input
            id="cityInput"
            v-model="form.city"
            type="text"
            placeholder="Enter city"
            :state="$v.form.city.$dirty && !$v.form.city.required ? !$v.form.city.$error : null"
          />
          <div class="invalid-feedback">Please provide a valid city.</div>
        </b-form-group>
      </b-col>
    </b-row>

    <b-form-group id="countryInputGroup" label="Country:" label-for="countryInput">
      <b-form-select
        id="countryInput"
        v-model="form.country"
        :options="countries"
        value-field="countryShortCode"
        text-field="countryName"
        @change="form.state = null"
        :state="$v.form.country.$dirty && !$v.form.country.required ? !$v.form.country.$error : null"
      ></b-form-select>
      <div class="invalid-feedback">Please select a country.</div>
    </b-form-group>

    <b-form-group id="stateInputGroup" label="State:" label-for="stateInput">
      <b-form-select
        id="stateInput"
        v-model="form.state"
        :options="regions"
        value-field="shortCode"
        text-field="name"
        :state="$v.form.state.$dirty && !$v.form.state.required ? !$v.form.state.$error : null"
      ></b-form-select>
      <div class="invalid-feedback">Please select a state.</div>
    </b-form-group>

    <b-form-group
      id="vatNumberInputGroup"
      label="VAT Number:"
      label-for="vatNumberInput"
      v-if="form.company"
    >
      <b-form-input
        id="vatNumberInput"
        v-model="form.vatNumber"
        type="text"
        placeholder="Enter VAT number"
        :state="$v.form.vatNumber.$dirty && !$v.form.vatNumber.required ? !$v.form.vatNumber.$error : null"
        v-bind="{disabled: isDisabled('vatNumber')}"
      />
    </b-form-group>

    <b-alert
      :show="dismissCountDown"
      class="mt-2 mb-2"
      fade
      dismissible
      variant="danger"
      @dismiss-count-down="countDownChanged"
    >{{ updateError }}</b-alert>
    <b-button type="submit" variant="primary">Save</b-button>
  </b-form>
</template>

<script>
import gql from 'graphql-tag'
import { mapMutations } from 'vuex'
import countries from 'country-region-data'
import { required, requiredIf } from 'vuelidate/lib/validators'

const europeanCountries = [
  'AT',
  'BE',
  'BG',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'EL',
  'ES',
  'FI',
  'FR',
  'GB',
  'HR',
  'HU',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK'
]

export default {
  name: 'EditUser',
  props: ['form'],
  data() {
    return {
      updateError: false,
      dismissSecs: 5,
      dismissCountDown: 0,
      type: [{ text: 'Individual', value: 'individual' }, { text: 'Company', value: 'company' }],
      countries: countries
    }
  },
  validations: {
    form: {
      name: {
        required
      },
      organization: {
        required: requiredIf(function(nestedModel) {
          return nestedModel.company
        })
      },
      address1: {
        required: requiredIf(function(nestedModel) {
          return nestedModel.company
        })
      },
      zipCode: {
        required: requiredIf(function(nestedModel) {
          return nestedModel.company
        })
      },
      city: {
        required: requiredIf(function(nestedModel) {
          return nestedModel.company
        })
      },
      country: {
        required: requiredIf(function(nestedModel) {
          return nestedModel.company
        })
      },
      state: {
        required: requiredIf(function(nestedModel) {
          return nestedModel.company
        })
      },
      vatNumber: {
        required: requiredIf(function(nestedModel) {
          return nestedModel.company && europeanCountries.includes(nestedModel.country)
        })
      }
    }
  },
  computed: {
    regions: function() {
      return this.form.country ? countries.find(c => c.countryShortCode === this.form.country).regions : []
    }
  },
  methods: {
    ...mapMutations(['updateMe']),
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    onSubmit(e) {
      e.preventDefault()
      this.$v.form.$touch()

      if (this.$v.form.$anyError) {
        return
      }

      this.$apollo
        .mutate({
          mutation: gql`
            mutation(
              $id: String!
              $company: Boolean
              $name: String
              $organization: String
              $address1: String
              $address2: String
              $zipCode: String
              $city: String
              $country: String
              $state: String
              $vatNumber: String
            ) {
              updateUser(
                id: $id
                company: $company
                name: $name
                organization: $organization
                address1: $address1
                address2: $address2
                zipCode: $zipCode
                city: $city
                country: $country
                state: $state
                vatNumber: $vatNumber
              ) {
                company
                name
                organization
                address1
                address2
                zipCode
                city
                country
                state
                vatNumber
              }
            }
          `,
          variables: {
            id: this.$store.state.auth.user.userId,
            company: this.form.company,
            name: this.form.name,
            organization: this.form.organization,
            address1: this.form.address1,
            address2: this.form.address2,
            zipCode: this.form.zipCode,
            city: this.form.city,
            country: this.form.country,
            state: this.form.state,
            vatNumber: this.form.vatNumber
          }
        })
        .then(resp => {
          this.updateMe(resp.data.updateUser)
          this.$root.$emit('fluctuo::editUser::updated')
        })
        .catch(err => {
          this.dismissCountDown = this.dismissSecs
          this.updateError = err.message
        })
    },
    isDisabled(value) {
      return !!this.$store.state.auth.user[value]
    }
  }
}
</script>
