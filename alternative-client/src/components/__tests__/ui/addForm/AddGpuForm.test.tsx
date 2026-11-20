import { describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Component
import AddGpuForm from "../../../ui/addForm/AddGpuForm";

// Mocked context
import createMockContext from "../../../../test-utils/createMockContext";
import GpuContext from "../../../../context/GpuContext";

// Data
import sampleData from "../../../../test-utils/data/fixtures";

// TypeScript types
import type { GpuContextType } from "../../../../types/context";
import type { GpuInputType } from "../../../../../../shared/types/types";

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

// Helper functions
function getInputFields() {
  // Select each of the input fields available on the form
  return {
    manufacturerField: screen.getByLabelText(/manufacturer/i, {
      selector: "input",
    }),
    gpuLineField: screen.getByLabelText(/line/i, { selector: "input" }),
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

// Receives all of the form input fields and fill them with the prop object data
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
    test("the submit button and input fields are correctly rendered", () => {
      const mockContextValue = createMockContext();

      // Render the form component
      render(
        <GpuContext.Provider value={mockContextValue}>
          <AddGpuForm />
        </GpuContext.Provider>,
      );

      // Confirm each field is present within the add form
      expect(screen.getByLabelText(/manufacturer/i, { selector: "input" })).toBeInTheDocument();
      expect(screen.getByLabelText(/line/i, { selector: "input" })).toBeInTheDocument();
      expect(screen.getByLabelText(/model/i, { selector: "input" })).toBeInTheDocument();
      expect(screen.getByLabelText(/cores/i, { selector: "input" })).toBeInTheDocument();
      expect(screen.getByLabelText(/tmus/i, { selector: "input" })).toBeInTheDocument();
      expect(screen.getByLabelText(/rops/i, { selector: "input" })).toBeInTheDocument();
      expect(screen.getByLabelText(/vram/i, { selector: "input" })).toBeInTheDocument();
      expect(screen.getByLabelText(/bus width/i, { selector: "input" })).toBeInTheDocument();
      expect(screen.getByLabelText(/memory type/i, { selector: "input" })).toBeInTheDocument();
      expect(screen.getByLabelText(/base clock/i, { selector: "input" })).toBeInTheDocument();
      expect(screen.getByLabelText(/boost clock/i, { selector: "input" })).toBeInTheDocument();
      expect(screen.getByLabelText(/memory clock/i, { selector: "input" })).toBeInTheDocument();

      // Confirm the Submit button is present
      expect(screen.queryByRole("button", { name: /submit/i })).toBeInTheDocument();
    });
  });

  describe("the web form functionality", () => {
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

      // Get the input fields and fill them
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

      // Get the input fields and fill them with the sample data
      const formFields = getInputFields();
      await fillInputFields(formFields, gpuData);

      // Assert the correct value is present within each respective field
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
      expect(mockContextOpenForm.addGpu).toHaveBeenCalledTimes(1);

      // Confirm the correct data has been passed on to the function
      expect(mockContextOpenForm.addGpu).toHaveBeenCalledWith({
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
    });

    test("the gpu line field is optional", async () => {
      const invalidInput = { ...sampleData.rtx5090, gpuline: undefined };

      const formFields = getInputFields();

      // @ts-expect-error - Ignore the optional line field
      await fillInputFields(formFields, invalidInput);

      // Assert the correct input is present on each respective field
      expect(formFields.manufacturerField).toHaveValue(
        invalidInput.manufacturer,
      );
      expect(formFields.modelField).toHaveValue(invalidInput.model);
      expect(formFields.coresField).toHaveValue(invalidInput.cores);
      expect(formFields.tmusField).toHaveValue(invalidInput.tmus);
      expect(formFields.ropsField).toHaveValue(invalidInput.rops);
      expect(formFields.vramField).toHaveValue(invalidInput.vram);
      expect(formFields.busField).toHaveValue(invalidInput.bus);
      expect(formFields.memTypeField).toHaveValue(invalidInput.memtype);
      expect(formFields.baseClockField).toHaveValue(invalidInput.baseclock);
      expect(formFields.boostClockField).toHaveValue(invalidInput.boostclock);
      expect(formFields.memClockField).toHaveValue(invalidInput.memclock);

      // Select the Submit button
      const submitButton = screen.getByRole("button", { name: /submit/i });

      // Submit the form
      await user.click(submitButton);

      // Confirm the add function has been called once
      expect(mockContextOpenForm.addGpu).toHaveBeenCalledTimes(1);

      // Confirm the correct data has been passed on to the function
      expect(mockContextOpenForm.addGpu).toHaveBeenCalledWith({
        ...invalidInput,
        gpuline: "",
      });
    });

    test("the manufacturer and model fields are required", async () => {
      const invalidInput = {
        ...sampleData.rtx5090,
        manufacturer: undefined,
        model: undefined,
      };

      const formFields = getInputFields();

      // @ts-expect-error - The invalid object is intentional, no need for type checking
      await fillInputFields(formFields, invalidInput);

      // Select the Submit button
      const submitButton = screen.getByRole("button", { name: /submit/i });

      // Submit the form
      await user.click(submitButton);

      // Confirm the add function has not been called
      expect(mockContextOpenForm.addGpu).not.toHaveBeenCalled();
    });
  });

  describe("invalid form data", () => {
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

    test("zero is an invalid value for the specification fields", async () => {
      const gpuData = {
        ...sampleData.rtx5090,
        cores: 0,
      };

      // Get the input fields and fill them
      const formFields = getInputFields();
      await fillInputFields(formFields, gpuData);

      // Select the Submit button
      const submitButton = screen.getByRole("button", { name: /submit/i });

      // Submit the form
      await user.click(submitButton);

      // Confirm the add function has not been called
      expect(mockContextOpenForm.addGpu).not.toHaveBeenCalled();
    });

    test("negative numbers are not allowed", async () => {
      const gpuData = {
        ...sampleData.rtx5090,
        cores: -1,
      };

      // Get the input fields and fill them
      const formFields = getInputFields();
      await fillInputFields(formFields, gpuData);

      // Select the Submit button
      const submitButton = screen.getByRole("button", { name: /submit/i });

      // Submit the form
      await user.click(submitButton);

      // Confirm the add function has not been called
      expect(mockContextOpenForm.addGpu).not.toHaveBeenCalled();
    });

    test("empty memory type field", async () => {
      const invalidInput = { ...sampleData.rtx5090, memtype: undefined };

      const formFields = getInputFields();

      // @ts-expect-error - The invalid object is intentional, no need for type checking
      await fillInputFields(formFields, invalidInput);

      // Select the Submit button
      const submitButton = screen.getByRole("button", { name: /submit/i });

      // Submit the form
      await user.click(submitButton);

      // Confirm the add function has not been called
      expect(mockContextOpenForm.addGpu).not.toHaveBeenCalled();
    });

    test("specification input fields should not accept float inputs", async () => {
      // Use non-integer clock values
      const gpuData = {
        ...sampleData.rtx5090,
        cores: 1.1,
        tmus: 1.1,
        rops: 1.1,
        bus: 1.1,
      };

      // Get the input fields and fill them
      const formFields = getInputFields();
      await fillInputFields(formFields, gpuData);

      // Select the Submit button
      const submitButton = screen.getByRole("button", { name: /submit/i });

      // Submit the form
      await user.click(submitButton);

      // Confirm the add function has not been called
      expect(mockContextOpenForm.addGpu).not.toHaveBeenCalled();
    });

    test("both core clock values should not accept float inputs", async () => {
      // Use non-integer clock values, such as values in GHz
      const gpuData = {
        ...sampleData.rtx5090,
        baseclock: 2.2,
        boostclock: 2.7,
      };

      // Get the input fields and fill them
      const formFields = getInputFields();
      await fillInputFields(formFields, gpuData);

      // Select the Submit button
      const submitButton = screen.getByRole("button", { name: /submit/i });

      // Submit the form
      await user.click(submitButton);

      // Confirm the add function has not been called
      expect(mockContextOpenForm.addGpu).not.toHaveBeenCalled();
    });
  });
});
