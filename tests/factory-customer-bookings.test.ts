import { afterEach, describe, expect, it } from "vitest";

import {
  factoryCustomers,
  filterPlannerCustomers,
  useFactoryStore,
  type FactoryCustomerBooking,
} from "@/apps/factory/store";

function resetFactoryStore() {
  useFactoryStore.setState({
    customers: [...factoryCustomers],
    customerBookings: {},
  });
}

function makeBooking(
  id: string,
  start: string,
  end: string,
): FactoryCustomerBooking {
  return {
    id,
    customerId: "cust-1",
    customerName: "BuildCorp Pty Ltd",
    start,
    end,
  };
}

describe("factory customer bookings", () => {
  afterEach(() => {
    resetFactoryStore();
  });

  it("stores customer bookings in a record", () => {
    const booking = makeBooking(
      "booking-1",
      "2026-07-08T09:00:00.000Z",
      "2026-07-08T10:00:00.000Z",
    );

    expect(useFactoryStore.getState().addCustomerBooking(booking)).toBe(true);
    expect(useFactoryStore.getState().customerBookings).toEqual({
      "booking-1": booking,
    });
  });

  it("accepts adjacent non-overlapping bookings", () => {
    const first = makeBooking(
      "booking-1",
      "2026-07-08T09:00:00.000Z",
      "2026-07-08T10:00:00.000Z",
    );
    const second = makeBooking(
      "booking-2",
      "2026-07-08T10:00:00.000Z",
      "2026-07-08T11:00:00.000Z",
    );

    expect(useFactoryStore.getState().addCustomerBooking(first)).toBe(true);
    expect(useFactoryStore.getState().addCustomerBooking(second)).toBe(true);
    expect(Object.keys(useFactoryStore.getState().customerBookings)).toEqual([
      "booking-1",
      "booking-2",
    ]);
  });

  it("rejects overlapping bookings", () => {
    const first = makeBooking(
      "booking-1",
      "2026-07-08T09:00:00.000Z",
      "2026-07-08T10:00:00.000Z",
    );
    const overlap = makeBooking(
      "booking-2",
      "2026-07-08T09:30:00.000Z",
      "2026-07-08T10:30:00.000Z",
    );

    expect(useFactoryStore.getState().addCustomerBooking(first)).toBe(true);
    expect(useFactoryStore.getState().addCustomerBooking(overlap)).toBe(false);
    expect(Object.keys(useFactoryStore.getState().customerBookings)).toEqual([
      "booking-1",
    ]);
  });

  it("deletes only the selected booking", () => {
    const first = makeBooking(
      "booking-1",
      "2026-07-08T09:00:00.000Z",
      "2026-07-08T10:00:00.000Z",
    );
    const second = makeBooking(
      "booking-2",
      "2026-07-08T10:00:00.000Z",
      "2026-07-08T11:00:00.000Z",
    );

    useFactoryStore.getState().addCustomerBooking(first);
    useFactoryStore.getState().addCustomerBooking(second);
    useFactoryStore.getState().deleteCustomerBooking("booking-1");

    expect(useFactoryStore.getState().customerBookings).toEqual({
      "booking-2": second,
    });
  });

  it("deletes a customer's bookings when the customer is deleted", () => {
    const custOneBooking = makeBooking(
      "booking-1",
      "2026-07-08T09:00:00.000Z",
      "2026-07-08T10:00:00.000Z",
    );
    const custTwoBooking: FactoryCustomerBooking = {
      id: "booking-2",
      customerId: "cust-2",
      customerName: "TechFab Solutions",
      start: "2026-07-08T10:00:00.000Z",
      end: "2026-07-08T11:00:00.000Z",
    };

    useFactoryStore.getState().addCustomerBooking(custOneBooking);
    useFactoryStore.getState().addCustomerBooking(custTwoBooking);
    useFactoryStore.getState().deleteCustomer("cust-1");

    expect(
      useFactoryStore.getState().customers.some((customer) => customer.id === "cust-1"),
    ).toBe(false);
    expect(useFactoryStore.getState().customerBookings).toEqual({
      "booking-2": custTwoBooking,
    });
  });

  it("filters planner customers by name, location, or country", () => {
    const customers = useFactoryStore.getState().customers;

    expect(filterPlannerCustomers(customers, "buildcorp")).toHaveLength(1);
    expect(filterPlannerCustomers(customers, "melbourne")).toHaveLength(1);
    expect(filterPlannerCustomers(customers, "australia").length).toBeGreaterThan(1);
  });
});
