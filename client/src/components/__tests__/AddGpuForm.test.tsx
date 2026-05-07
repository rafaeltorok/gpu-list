// Test dependencies
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Component
import AddGpuForm from "../AddGpuForm";

// Utils
import createMockContext from "../../test-utils/createMockContext";

// Data
import sampleData from "../../test-utils/data/fixtures";
import GpuContext from "../../context/GpuContext";

// TypeScript types
import type { GpuContextType } from "../../types/context";
import type { GpuInputType } from "../../../../shared/types/types";
import type { MockInstance } from "vitest";
interface FormFields {
  manufacturerField: HTMLElement;
  gpuLineField: HTMLElement;
  modelField: HTMLElement;
  coresField: HTMLElement;
  tmusField: HTMLElement;
  ropsField: HTMLElement;
  vramField: HTMLElement;
  busField: HTMLElement;
  memTypeField: HTMLElement;
  baseClockField: HTMLElement;
  boostClockField: HTMLElement;
  memClockField: HTMLElement;
}

// Global variables
let user: ReturnType<typeof userEvent.setup>;
let mockContextOpenForm: GpuContextType;
let alertMock: MockInstance;

// Helper functions
function getInputFields() {
  // Select each of the input fields available on the form
  return {
    manufacturerField: screen.getByLabelText(/manufacturer/i, {
      selector: "input",
    }),
    gpuLineField: screen.getByLabelText(/gpu line/i, { selector: "input" }),
    modelField: screen.getByLabelText(/model/i, { selector: "input" }),
    coresField: screen.getByLabelText(/cores/i, { selector: "input" }),
    tmusField: screen.getByLabelText(/tmus/i, { selector: "input" }),
    ropsField: screen.getByLabelText(/rops/i, { selector: "input" }),
    vramField: screen.getByLabelText(/vram/i, { selector: "input" }),
    busField: screen.getByLabelText(/bus width/i, { selector: "input" }),
    memTypeField: screen.getByLabelText(/memory type/i, { selector: "input" }),
    baseClockField: screen.getByLabelText(/base clock/i, { selector: "input" }),
    boostClockField: screen.getByLabelText(/boost clock/i, {
      selector: "input",
    }),
    memClockField: screen.getByLabelText(/memory clock/i, {
      selector: "input",
    }),
  };
}

async function fillInputFields(formFields: FormFields, gpuData: GpuInputType) {
  // Type on each one of the fields
  if (gpuData.manufacturer)
    await user.type(formFields.manufacturerField, gpuData.manufacturer);
  if (gpuData.gpuline)
    await user.type(formFields.gpuLineField, gpuData.gpuline);
  if (gpuData.model) await user.type(formFields.modelField, gpuData.model);
  if (gpuData.cores !== undefined)
    await user.type(formFields.coresField, String(gpuData.cores));
  if (gpuData.tmus !== undefined)
    await user.type(formFields.tmusField, String(gpuData.tmus));
  if (gpuData.rops !== undefined)
    await user.type(formFields.ropsField, String(gpuData.rops));
  if (gpuData.vram !== undefined)
    await user.type(formFields.vramField, String(gpuData.vram));
  if (gpuData.bus !== undefined)
    await user.type(formFields.busField, String(gpuData.bus));
  if (gpuData.memtype)
    await user.type(formFields.memTypeField, gpuData.memtype);
  if (gpuData.baseclock !== undefined)
    await user.type(formFields.baseClockField, String(gpuData.baseclock));
  if (gpuData.boostclock !== undefined)
    await user.type(formFields.boostClockField, String(gpuData.boostclock));
  if (gpuData.memclock !== undefined)
    await user.type(formFields.memClockField, String(gpuData.memclock));
}

// Tests
describe("Testing the add graphics card form", () => {
  beforeEach(() => {
    // Setup the user event
    user = userEvent.setup();
  });

  describe("basic form rendering", () => {
    test("the add form input fields are hidden by default", () => {
      const mockContextValue = createMockContext();

      // Render the form component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <AddGpuForm />
        </GpuContext.Provider>,
      );

      // Select the field set for the input fields
      const formFieldSet = screen.queryByRole("group");

      // Select the Submit button
      const submitButton = screen.queryByRole("button", { name: /submit/i });

      // Confirm the entire input field set is hidden
      expect(formFieldSet).not.toBeInTheDocument();

      // Confirm the Submit button is also hidden
      expect(submitButton).not.toBeInTheDocument();
    });
  });

  describe("the web form UI works", () => {
    beforeEach(() => {
      const mockContextValue = createMockContext();

      // Expand the add form
      mockContextOpenForm = {
        ...mockContextValue,
        uiState: {
          ...mockContextValue.uiState,
          showAddForm: true,
        },
      };

      // Render the form component
      render(
        <GpuContext.Provider value={mockContextOpenForm}>
          <AddGpuForm />
        </GpuContext.Provider>,
      );
    });

    test("each input field can be typed on", async () => {
      // Get sample data to be used as input
      const gpuData = sampleData.rtx5090;

      const formFields = getInputFields();

      await fillInputFields(formFields, gpuData);

      // Assert the correct input is present on each respective field
      expect(formFields.manufacturerField).toHaveValue(gpuData.manufacturer);
      expect(formFields.gpuLineField).toHaveValue(gpuData.gpuline);
      expect(formFields.modelField).toHaveValue(gpuData.model);
      expect(formFields.coresField).toHaveValue(gpuData.cores);
      expect(formFields.tmusField).toHaveValue(gpuData.tmus);
      expect(formFields.ropsField).toHaveValue(gpuData.rops);
      expect(formFields.vramField).toHaveValue(gpuData.vram);
      expect(formFields.busField).toHaveValue(gpuData.bus);
      expect(formFields.memTypeField).toHaveValue(gpuData.memtype);
      expect(formFields.baseClockField).toHaveValue(gpuData.baseclock);
      expect(formFields.boostClockField).toHaveValue(gpuData.boostclock);
      expect(formFields.memClockField).toHaveValue(gpuData.memclock);
    });

    test("the submit button works", async () => {
      // Add the sample data
      const gpuData = sampleData.rtx5090;

      const formFields = getInputFields();

      await fillInputFields(formFields, gpuData);

      // Assert the correct input is present on each respective field
      expect(formFields.manufacturerField).toHaveValue(gpuData.manufacturer);
      expect(formFields.gpuLineField).toHaveValue(gpuData.gpuline);
      expect(formFields.modelField).toHaveValue(gpuData.model);
      expect(formFields.coresField).toHaveValue(gpuData.cores);
      expect(formFields.tmusField).toHaveValue(gpuData.tmus);
      expect(formFields.ropsField).toHaveValue(gpuData.rops);
      expect(formFields.vramField).toHaveValue(gpuData.vram);
      expect(formFields.busField).toHaveValue(gpuData.bus);
      expect(formFields.memTypeField).toHaveValue(gpuData.memtype);
      expect(formFields.baseClockField).toHaveValue(gpuData.baseclock);
      expect(formFields.boostClockField).toHaveValue(gpuData.boostclock);
      expect(formFields.memClockField).toHaveValue(gpuData.memclock);

      // Select the Submit button
      const submitButton = screen.getByRole("button", { name: /submit/i });

      // Submit the form
      await user.click(submitButton);

      // Confirm the add function has been called once
      expect(mockContextOpenForm.createGpu).toHaveBeenCalledTimes(1);

      // Confirm the correct data has been passed on to the function
      expect(mockContextOpenForm.createGpu).toHaveBeenCalledWith({
        ...gpuData,
      });
    });
  });

  describe("testing optional and required fields", () => {
    beforeEach(() => {
      const mockContextValue = createMockContext();

      // Expand the add form
      mockContextOpenForm = {
        ...mockContextValue,
        uiState: {
          ...mockContextValue.uiState,
          showAddForm: true,
        },
      };

      // Render the form component
      render(
        <GpuContext.Provider value={mockContextOpenForm}>
          <AddGpuForm />
        </GpuContext.Provider>,
      );

      // Mock the alert message
      alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    });

    afterEach(() => {
      alertMock.mockRestore();
    });

    test("the gpu line field is optional", async () => {
      const { gpuline, ...otherFields } = sampleData.rtx5090;

      const formFields = getInputFields();

      // @ts-expect-error
      await fillInputFields(formFields, otherFields);

      // Assert the correct input is present on each respective field
      expect(formFields.manufacturerField).toHaveValue(
        otherFields.manufacturer,
      );
      expect(formFields.modelField).toHaveValue(otherFields.model);
      expect(formFields.coresField).toHaveValue(otherFields.cores);
      expect(formFields.tmusField).toHaveValue(otherFields.tmus);
      expect(formFields.ropsField).toHaveValue(otherFields.rops);
      expect(formFields.vramField).toHaveValue(otherFields.vram);
      expect(formFields.busField).toHaveValue(otherFields.bus);
      expect(formFields.memTypeField).toHaveValue(otherFields.memtype);
      expect(formFields.baseClockField).toHaveValue(otherFields.baseclock);
      expect(formFields.boostClockField).toHaveValue(otherFields.boostclock);
      expect(formFields.memClockField).toHaveValue(otherFields.memclock);

      // Select the Submit button
      const submitButton = screen.getByRole("button", { name: /submit/i });

      // Submit the form
      await user.click(submitButton);

      // Confirm the add function has been called once
      expect(mockContextOpenForm.createGpu).toHaveBeenCalledTimes(1);

      // Confirm the correct data has been passed on to the function
      expect(mockContextOpenForm.createGpu).toHaveBeenCalledWith({
        ...otherFields,
        gpuline: "",
      });
    });

    test("the manufacturer and model fields are required", async () => {
      const { manufacturer, model, ...otherFields } = sampleData.rtx5090;

      const formFields = getInputFields();

      // @ts-expect-error
      await fillInputFields(formFields, otherFields);

      // Select the Submit button
      const submitButton = screen.getByRole("button", { name: /submit/i });

      // Submit the form
      await user.click(submitButton);

      // Confirm the add function has not been called
      expect(mockContextOpenForm.createGpu).not.toHaveBeenCalled();

      // Assert the message
      expect(alertMock).toHaveBeenCalledWith("Invalid GPU data");

      // Clean up
      alertMock.mockRestore();
    });

    test("zero is an invalid value for the specification fields", async () => {
      const gpuData = {
        ...sampleData.rtx5090,
        cores: 0,
      };

      const formFields = getInputFields();

      await fillInputFields(formFields, gpuData);

      // Select the Submit button
      const submitButton = screen.getByRole("button", { name: /submit/i });

      // Submit the form
      await user.click(submitButton);

      // Confirm the add function has not been called
      expect(mockContextOpenForm.createGpu).not.toHaveBeenCalled();

      // Assert the message
      expect(alertMock).toHaveBeenCalledWith("Invalid GPU data");

      // Clean up
      alertMock.mockRestore();
    });

    test("negative numbers are not allowed", async () => {
      const gpuData = {
        ...sampleData.rtx5090,
        cores: -1,
      };

      const formFields = getInputFields();

      await fillInputFields(formFields, gpuData);

      // Select the Submit button
      const submitButton = screen.getByRole("button", { name: /submit/i });

      // Submit the form
      await user.click(submitButton);

      // Confirm the add function has not been called
      expect(mockContextOpenForm.createGpu).not.toHaveBeenCalled();

      // Assert the message
      expect(alertMock).toHaveBeenCalledWith("Invalid GPU data");

      // Clean up
      alertMock.mockRestore();
    });

    test("empty memory type field", async () => {
      const { memtype, ...otherFields } = sampleData.rtx5090;

      const formFields = getInputFields();

      // @ts-expect-error
      await fillInputFields(formFields, otherFields);

      // Select the Submit button
      const submitButton = screen.getByRole("button", { name: /submit/i });

      // Submit the form
      await user.click(submitButton);

      // Confirm the add function has not been called
      expect(mockContextOpenForm.createGpu).not.toHaveBeenCalled();

      // Assert the message
      expect(alertMock).toHaveBeenCalledWith("Invalid GPU data");

      // Clean up
      alertMock.mockRestore();
    });

    test("both core clock values do not accept float inputs", async () => {
      // Use non-integer clock values, as in GHz
      const gpuData = {
        ...sampleData.rtx5090,
        baseclock: 2.2,
        boostclock: 2.7,
      };

      const formFields = getInputFields();

      await fillInputFields(formFields, gpuData);

      // Select the Submit button
      const submitButton = screen.getByRole("button", { name: /submit/i });

      // Submit the form
      await user.click(submitButton);

      // Confirm the add function has not been called
      expect(mockContextOpenForm.createGpu).not.toHaveBeenCalled();

      // Assert the message
      expect(alertMock).toHaveBeenCalledWith("Invalid GPU data");

      // Clean up
      alertMock.mockRestore();
    });
  });
});
