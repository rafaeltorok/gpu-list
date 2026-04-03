// TypeScript types
import type { GpuInputType } from "../../../../shared/types/types";

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to type a few random words into input elements
       * @param count=3
       * @example cy.get('input').typeRandomWords()
       */
      // setup commands
      setupDatabase(): Chainable<Cypress.Response<unknown>>,

      // addForm commands
      fillAddForm(gpu: GpuInputType): Chainable<void>,

      // dataTables commands
      showData(gpuName: string): Chainable<void>,
      checkRowData(rowName: string, data: string | number): Chainable<void>,
      checkSpecs(gpu: GpuInputType, index: number, vramSuffix: string): Chainable<void>,

      // gpu commands
      createGpu(gpuObject: GpuInputType): Chainable<Cypress.Response<unknown>>,
      addSampleData(): Chainable<void>,

      // index commands
      indexSelector(itemName: string): Chainable<void>
    }
  }
}