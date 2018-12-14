<template>
  <b-container>
    <b-row>
      <b-col class="mb-5 pt-5">
        <b-breadcrumb :items="breadcrumb" class="d-print-none"/>
        <b-row>
          <b-col>
            <h3 class="mb-4">Invoice</h3>
          </b-col>
          <b-col>
            <b-btn variant="info" class="float-right d-print-none" @click="print()">
              <printer-icon/>
            </b-btn>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <p v-html="invoice.payableTo && invoice.payableTo.join('<br>')"/>
          </b-col>
          <b-col>
            <p v-html="invoice.billTo && invoice.billTo.join('<br>')"/>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <p>
              <b>Reference</b>
              #{{ invoice.id }}
              <br>
              <b>Status</b>
              {{ invoice.status }}
              <br>
              <b>Invoice date</b>
              {{ invoice.createdAt | format('DD/MM/YYYY') }}
              <br>
              <span v-if="invoice.status === 'PAID'">
                <b>Paid date</b>
                {{ invoice.paidAt | format('DD/MM/YYYY HH:mm') }}
              </span>
            </p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <table class="table table-striped">
              <thead class="thead-dark">
                <tr class="text-center">
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="line in invoice.lines" :key="line.product">
                  <td>{{ line.product }}</td>
                  <td class="text-center">{{ line.count }}</td>
                  <td class="text-center">{{ line.unitPrice | money }} per {{ line.unitCount }}</td>
                  <td class="text-right">{{ line.price | money }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr v-if="invoice.taxPercent !== 0">
                  <td colspan="3" class="text-right font-weight-bold">Subtotal</td>
                  <td class="text-right">{{ invoice.subtotal | money }}</td>
                </tr>
                <tr v-if="invoice.taxPercent !== 0">
                  <td
                    colspan="3"
                    class="text-right font-weight-bold"
                  >Tax ({{ invoice.taxPercent }}%)</td>
                  <td class="text-right">{{ invoice.tax | money }}</td>
                </tr>
                <tr>
                  <td colspan="3" class="text-right font-weight-bold">Total</td>
                  <td class="text-right font-weight-bold">{{ invoice.total | money }}</td>
                </tr>
              </tfoot>
              <caption v-if="invoice.taxPercent === 0">Exempt from VAT</caption>
            </table>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import gql from 'graphql-tag'
import { PrinterIcon } from 'vue-feather-icons'

export default {
  name: 'Invoice',
  middleware: ['auth'],
  components: {
    PrinterIcon
  },
  head() {
    return {
      title: `Invoice ${this.$route.params.id}`
    }
  },
  data() {
    return {
      breadcrumb: [
        {
          text: 'Account',
          href: '/account'
        },
        {
          text: 'Invoices',
          href: '/account/invoices'
        },
        {
          text: `Invoice`,
          active: true
        }
      ],
      invoice: {}
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
        case 'UNPAID':
          variant = 'secondary'
          break
        default:
          variant = 'secondary'
          break
      }
    },
    print() {
      window.print()
    }
  },
  apollo: {
    invoice: {
      fetchPolicy: 'cache-first',
      query: gql`
        query($invoiceId: String!) {
          invoice(invoiceId: $invoiceId) {
            id
            billTo
            payableTo
            paidAt
            createdAt
            status
            period {
              start
              end
            }
            lines {
              product
              count
              unitCount
              unitPrice
              price
            }
            total
            subtotal
            tax
            taxPercent
          }
        }
      `,
      variables() {
        return { invoiceId: this.$route.params.id }
      },
      error(err) {
        this.$auth.logout()
      }
    }
  }
}
</script>
