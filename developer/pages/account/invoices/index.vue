<template>
  <b-container>
    <b-row>
      <b-col class="mb-5 pt-5">
        <b-breadcrumb :items="breadcrumb" class="d-print-none"/>
        <h3 class="mb-4">Invoices</h3>

        <b-table
          :items="invoices.invoices"
          :fields="fields"
          :per-page="invoices.limit"
          show-empty
          striped
          hover
          stacked="sm"
          head-variant="dark"
          @row-clicked="gotoInvoice"
        >
          <template slot="status" slot-scope="row">
            <b-badge :variant="getBadgeVariant(row.item.status)">{{ row.item.status.toLowerCase() }}</b-badge>
          </template>
          <template slot="period" slot-scope="row">{{ row.item.period | currentMonth }}</template>
          <template slot="total" slot-scope="row">{{ Number(row.item.total / 100).toFixed(2) }} €</template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import gql from 'graphql-tag'

export default {
  middleware: ['auth'],
  components: {},
  data() {
    return {
      breadcrumb: [
        {
          text: 'Account',
          href: '/account'
        },
        {
          text: 'Invoices',
          active: true
        }
      ],
      page: 1,
      fields: [
        {
          key: 'status',
          label: 'Status'
        },
        {
          key: 'period',
          label: 'Period'
        },
        {
          key: 'total',
          label: 'Amount'
        }
      ],
      invoices: {
        total: 0,
        invoices: []
      }
    }
  },
  methods: {
    getBadgeVariant(status) {
      let variant
      switch (status) {
        case 'UNPAID':
          variant = 'primary'
          break
        case 'PAID':
          variant = 'success'
          break
        case 'DELETED':
          variant = 'secondary'
          break
        default:
          variant = 'secondary'
          break
      }

      return variant
    },
    gotoInvoice(invoice) {
      this.$router.push({ name: 'account-invoices-id', params: { id: invoice.id } })
    }
  },
  apollo: {
    invoices: {
      fetchPolicy: 'cache-first',
      query: gql`
        query($page: Int, $userId: String) {
          invoices(page: $page, userId: $userId) {
            page
            total
            limit
            invoices {
              id
              status
              period {
                start
                end
              }
              total
            }
          }
        }
      `,
      variables() {
        return { page: this.page, userId: this.$store.state.auth.user.userId }
      },
      update(data) {
        return data.invoices ? JSON.parse(JSON.stringify(data.invoices)) : data
      },
      error(err) {
        this.$auth.logout()
      }
    }
  }
}
</script>
