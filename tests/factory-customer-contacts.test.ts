import { afterEach, describe, expect, it } from "vitest";

import {
  factoryCustomers,
  filterCustomerContacts,
  getActiveCustomerContacts,
  useFactoryStore,
  type FactoryCustomerContact,
} from "@/apps/factory/store";

function resetCustomers() {
  useFactoryStore.setState({ customers: factoryCustomers });
}

describe("factory customer contacts", () => {
  afterEach(() => {
    resetCustomers();
  });

  it("initializes mock customers with multiple active contacts", () => {
    const buildCorp = useFactoryStore
      .getState()
      .customers.find((customer) => customer.id === "cust-1");

    expect(buildCorp?.contacts).toHaveLength(3);
    expect(buildCorp?.contacts[0]).toMatchObject({
      contactName: "John Anderson",
      archived: false,
    });
  });

  it("filters active contacts by name, email, phone, or mobile", () => {
    const buildCorp = useFactoryStore
      .getState()
      .customers.find((customer) => customer.id === "cust-1");

    expect(buildCorp).toBeDefined();
    if (!buildCorp) return;

    expect(
      filterCustomerContacts(buildCorp.contacts, "nina").map(
        (contact) => contact.contactName,
      ),
    ).toEqual(["Nina Patel"]);
    expect(
      filterCustomerContacts(buildCorp.contacts, "555 160").map(
        (contact) => contact.contactName,
      ),
    ).toEqual(["Owen Hughes"]);
  });

  it("adds a contact to the selected customer", () => {
    const contact: FactoryCustomerContact = {
      id: "contact-test",
      contactName: "Test Contact",
      email: "test@example.com",
      phone: "+61 2 9000 0001",
      mobile: "+61 400 000 001",
      avatar: "/src/assets/avatar/agent_avatar_24.svg",
      archived: false,
    };

    useFactoryStore.getState().addCustomerContact("cust-2", contact);

    const techFab = useFactoryStore
      .getState()
      .customers.find((customer) => customer.id === "cust-2");

    expect(techFab?.contacts.at(-1)).toMatchObject(contact);
  });

  it("updates only the target contact", () => {
    useFactoryStore.getState().updateCustomerContact("cust-3", "contact-3-2", {
      contactName: "Aisha Roberts-Singh",
      mobile: "+61 499 555 404",
    });

    const precisionParts = useFactoryStore
      .getState()
      .customers.find((customer) => customer.id === "cust-3");
    const updated = precisionParts?.contacts.find(
      (contact) => contact.id === "contact-3-2",
    );
    const untouched = precisionParts?.contacts.find(
      (contact) => contact.id === "contact-3-1",
    );

    expect(updated).toMatchObject({
      contactName: "Aisha Roberts-Singh",
      mobile: "+61 499 555 404",
    });
    expect(untouched?.contactName).toBe("Robert Clark");
  });

  it("archives contacts and excludes them from active contacts", () => {
    useFactoryStore
      .getState()
      .archiveCustomerContact("cust-4", "contact-4-1");

    const globalManufacturing = useFactoryStore
      .getState()
      .customers.find((customer) => customer.id === "cust-4");
    const archived = globalManufacturing?.contacts.find(
      (contact) => contact.id === "contact-4-1",
    );

    expect(archived?.archived).toBe(true);
    expect(
      globalManufacturing
        ? getActiveCustomerContacts(globalManufacturing).map(
            (contact) => contact.id,
          )
        : [],
    ).not.toContain("contact-4-1");
  });
});
