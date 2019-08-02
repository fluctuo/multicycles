<template>
  <b-container>
    <b-row>
      <b-col class="mb-5 pt-5">
        <b-breadcrumb :items="breadcrumb" class="d-print-none" />

        <div v-if="invoice.model === 2" card-header>
          <b-row class="mb-5">
            <b-col class="flex-grow-0">
              <img src="../../../assets/invoice-logo.png" />
            </b-col>
            <b-col class="align-items-center col d-flex flex-grow-1 justify-content-center">
              <h1>Invoice</h1>
            </b-col>
            <b-col class="flex-grow-0">
              <b-btn variant="info" class="float-right d-print-none" @click="print()">
                <printer-icon />
              </b-btn>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <p v-html="invoice.payableTo && invoice.payableTo.join('<br>')" />
            </b-col>
            <b-col class="text-right">
              <p v-html="invoice.billTo && invoice.billTo.join('<br>')" />
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <b>VAT</b>
              {{ invoice.fluctuoContact.vatNumber}}
              <br />
              <br />
              <b>Contact</b>
              {{ invoice.fluctuoContact.contact }}
              <br />
              <b>Phone</b>
              {{ invoice.fluctuoContact.phone }}
              <br />
              <b>Email</b>
              {{ invoice.fluctuoContact.email }}
              <br />
            </b-col>

            <b-col class="text-right">
              <span v-if="invoice.customerContact.vatNumber">
                <b>VAT</b>
                {{ invoice.customerContact.vatNumber}}
                <br />
                <br />
              </span>
              <b>Contact</b>
              {{ invoice.customerContact.contact }}
              <br />
              <span v-if="invoice.customerContact.phone">
                <b>Phone</b>
                {{ invoice.customerContact.phone }}
                <br />
              </span>
              <b>Email</b>
              {{ invoice.customerContact.email }}
              <br />
            </b-col>
          </b-row>

          <b-row class="mt-3">
            <b-col>
              <p>
                <b>Invoice</b>
                #{{ invoice.reference }}
                <br />

                <b>Date of issue</b>
                {{ invoice.createdAt | format('DD/MM/YYYY') }}
                <br />
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
                    <th>Total VAT excl.</th>
                    <th>VAT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="line in invoice.lines" :key="line.product">
                    <td>{{ line.product }}</td>
                    <td class="text-center">{{ line.count }}</td>
                    <td class="text-center">{{ line.unitPrice | money }} per {{ line.unitCount }}</td>
                    <td class="text-right">{{ line.price | money }}</td>
                    <td class="text-right">{{ line.taxRate || '0' }}%</td>
                  </tr>
                </tbody>
              </table>
            </b-col>
          </b-row>

          <b-row>
            <b-col sm="6" offset="6">
              <table class="table table-striped table-sm">
                <tbody>
                  <tr>
                    <td colspan="4" class="text-right">Total VAT excl.</td>
                    <td class="text-right">{{ invoice.subtotal | money }}</td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-right">VAT</td>
                    <td class="text-right">{{ invoice.tax | money }}</td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-right font-weight-bold">Total VAT incl.</td>
                    <td class="text-right font-weight-bold">{{ invoice.total | money }}</td>
                  </tr>
                </tbody>
              </table>
              <b>Status</b>
              {{ invoice.status }}
              <br />
              <span v-if="invoice.status === 'PAID'">
                <b>Paid date</b>
                {{ invoice.paidAt | format('DD/MM/YYYY HH:mm') }}
              </span>
            </b-col>
          </b-row>

          <b-row class="mt-5">
            <b-col>
              Terms of Payment :
              <ul>
                <li>Payment shall only be made by transfer to our bank account</li>
                <li>Total payment is due within 30 days from the invoice date</li>
                <li>Late Payment Penalty : 3 times the legal interest rate plus a 40 € fixed compensation (recovery costs)</li>
              </ul>
            </b-col>
          </b-row>
          <b-row class="mt-3">
            <b-col>
              <p v-html="invoice.payableTo && invoice.payableTo.join('<br>')" />
              <b>Email</b> contact@fluctuo.com
            </b-col>
            <b-col>
              <b>IBAN</b>
              {{ invoice.fluctuoCompany.iban }}
              <br />
              <b>BIC</b>
              {{ invoice.fluctuoCompany.bic }}
              <br />
              <b>SIREN</b>
              {{ invoice.fluctuoCompany.siren }}
              <br />
              <b>NAF</b>
              {{ invoice.fluctuoCompany.naf }}
              <br />
              <b>VAT</b>
              {{ invoice.fluctuoCompany.vatNumber }}
            </b-col>
          </b-row>
        </div>
        <div v-else>
          <b-row class="my-5 text-center">
            <b-col>
              <h1>Invoice</h1>
            </b-col>
            <b-col>
              <b-btn variant="info" class="float-right d-print-none" @click="print()">
                <printer-icon />
              </b-btn>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <p v-html="invoice.payableTo && invoice.payableTo.join('<br>')" />
            </b-col>
            <b-col>
              <p v-html="invoice.billTo && invoice.billTo.join('<br>')" />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <p>
                <b>Reference</b>
                #{{ invoice.id }}
                <br />
                <b>Status</b>
                {{ invoice.status }}
                <br />
                <b>Invoice date</b>
                {{ invoice.createdAt | format('DD/MM/YYYY') }}
                <br />
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
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import gql from 'graphql-tag'
import { PrinterIcon } from 'vue-feather-icons'

export default {
  name: 'Invoice',
  components: {
    PrinterIcon
  },
  head() {
    return {
      title: `Invoice #${this.invoice.reference}`
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
            reference
            model
            billTo
            payableTo
            fluctuoContact
            fluctuoCompany
            customerContact
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
              taxRate
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
      }
    }
  }
}
</script>
