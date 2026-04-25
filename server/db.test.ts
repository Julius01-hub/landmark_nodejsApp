import { describe, expect, it, beforeEach } from "vitest";
import { createContact, getContacts, deleteContact } from "./db";

// The db module uses an in-memory store when DATABASE_URL is not set,
// which is the case in the test environment.

describe("in-memory database CRUD", () => {
  // Each test creates its own contacts so ordering is predictable.

  it("createContact returns a contact with an id and createdAt", async () => {
    const contact = await createContact({
      name: "Alice",
      email: "alice@example.com",
      contact: "111-111-1111",
      address: "1 First St",
      country: "USA",
    });

    expect(contact).not.toBeNull();
    expect(contact!.id).toBeTypeOf("number");
    expect(contact!.name).toBe("Alice");
    expect(contact!.email).toBe("alice@example.com");
    expect(contact!.createdAt).toBeInstanceOf(Date);
  });

  it("createContact assigns incrementing ids", async () => {
    const a = await createContact({
      name: "Bob",
      email: "bob@example.com",
      contact: "222",
      address: "2 Second St",
      country: "Canada",
    });
    const b = await createContact({
      name: "Carol",
      email: "carol@example.com",
      contact: "333",
      address: "3 Third St",
      country: "UK",
    });

    expect(b!.id).toBeGreaterThan(a!.id);
  });

  it("getContacts returns all created contacts", async () => {
    const before = (await getContacts()).length;
    await createContact({
      name: "Dave",
      email: "dave@example.com",
      contact: "444",
      address: "4 Fourth St",
      country: "Germany",
    });
    const after = await getContacts();

    expect(after.length).toBe(before + 1);
  });

  it("getContacts returns newest first", async () => {
    const first = await createContact({
      name: "Eve",
      email: "eve@example.com",
      contact: "555",
      address: "5 Fifth St",
      country: "France",
    });
    const second = await createContact({
      name: "Frank",
      email: "frank@example.com",
      contact: "666",
      address: "6 Sixth St",
      country: "Japan",
    });

    const list = await getContacts();
    expect(list[0].id).toBe(second!.id);
  });

  it("deleteContact removes the contact and returns true", async () => {
    const contact = await createContact({
      name: "Grace",
      email: "grace@example.com",
      contact: "777",
      address: "7 Seventh St",
      country: "Australia",
    });

    const result = await deleteContact(contact!.id);
    expect(result).toBe(true);

    const list = await getContacts();
    const found = list.find((c) => c.id === contact!.id);
    expect(found).toBeUndefined();
  });

  it("deleteContact returns false for non-existent id", async () => {
    const result = await deleteContact(999999);
    expect(result).toBe(false);
  });

  it("handles creating multiple contacts in rapid succession", async () => {
    const promises = Array.from({ length: 5 }, (_, i) =>
      createContact({
        name: `Batch User ${i}`,
        email: `batch${i}@example.com`,
        contact: `${i}${i}${i}`,
        address: `${i} Batch Rd`,
        country: "Brazil",
      })
    );

    const results = await Promise.all(promises);
    results.forEach((r) => {
      expect(r).not.toBeNull();
      expect(r!.id).toBeTypeOf("number");
    });

    const ids = results.map((r) => r!.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(5);
  });

  it("delete does not affect other contacts", async () => {
    const keep = await createContact({
      name: "Keep Me",
      email: "keep@example.com",
      contact: "000",
      address: "0 Zero St",
      country: "Mexico",
    });
    const remove = await createContact({
      name: "Remove Me",
      email: "remove@example.com",
      contact: "999",
      address: "9 Nine St",
      country: "India",
    });

    await deleteContact(remove!.id);
    const list = await getContacts();
    expect(list.find((c) => c.id === keep!.id)).toBeDefined();
    expect(list.find((c) => c.id === remove!.id)).toBeUndefined();
  });
});
