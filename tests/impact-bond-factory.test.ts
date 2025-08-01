import { describe, it, expect, beforeEach } from "vitest"

const factory = {
  admin: "ST1ADMINADDRESS",
  bondId: 0,
  registry: new Map<number, any>(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 100 }
    if (newAdmin === "SP000000000000000000002Q6VF78") return { error: 102 }
    this.admin = newAdmin
    return { value: true }
  },

  createBond(caller: string, title: string, goal: bigint, verifier: string) {
    if (verifier === "SP000000000000000000002Q6VF78") return { error: 102 }
    const bond = {
      ngo: caller,
      verifier,
      title,
      goal,
      funded: 0n,
      isFunded: false,
      verified: false,
      active: true,
    }
    this.registry.set(this.bondId, bond)
    return { value: this.bondId++ }
  },

  fundBond(caller: string, bondId: number, amount: bigint) {
    const bond = this.registry.get(bondId)
    if (!bond || !bond.active) return { error: 101 }
    bond.funded += amount
    if (bond.funded >= bond.goal) bond.isFunded = true
    this.registry.set(bondId, bond)
    return { value: true }
  },

  verifyBond(caller: string, bondId: number) {
    const bond = this.registry.get(bondId)
    if (!bond) return { error: 101 }
    if (bond.verifier !== caller) return { error: 100 }
    bond.verified = true
    bond.active = false
    this.registry.set(bondId, bond)
    return { value: true }
  },

  getBond(bondId: number) {
    const bond = this.registry.get(bondId)
    return bond ? { value: bond } : { error: 101 }
  }
}

describe("ImpactBondFactory", () => {
  const NGO = "ST2NGO..."
  const VERIFIER = "ST3VERIFY..."

  beforeEach(() => {
    factory.bondId = 0
    factory.registry = new Map()
    factory.admin = "ST1ADMINADDRESS"
  })

  it("should allow admin to transfer admin rights", () => {
    const result = factory.transferAdmin("ST1ADMINADDRESS", "ST1NEWADMIN")
    expect(result).toEqual({ value: true })
    expect(factory.admin).toBe("ST1NEWADMIN")
  })

  it("should create a new bond campaign", () => {
    const result = factory.createBond(NGO, "Tree Planting", 1000n, VERIFIER)
    expect(result.value).toBe(0)
    const bond = factory.getBond(0).value
    expect(bond.goal).toBe(1000n)
    expect(bond.title).toBe("Tree Planting")
  })

  it("should fund a bond and mark as funded when goal is reached", () => {
    factory.createBond(NGO, "Clean Water", 1000n, VERIFIER)
    factory.fundBond("ST4FUND", 0, 500n)
    const mid = factory.getBond(0).value
    expect(mid.isFunded).toBe(false)
    factory.fundBond("ST4FUND", 0, 600n)
    const final = factory.getBond(0).value
    expect(final.isFunded).toBe(true)
  })

  it("should verify a bond by the assigned verifier", () => {
    factory.createBond(NGO, "Solar School", 2000n, VERIFIER)
    const result = factory.verifyBond(VERIFIER, 0)
    expect(result).toEqual({ value: true })
    const bond = factory.getBond(0).value
    expect(bond.verified).toBe(true)
    expect(bond.active).toBe(false)
  })

  it("should not verify if not the assigned verifier", () => {
    factory.createBond(NGO, "Irrigation", 500n, VERIFIER)
    const result = factory.verifyBond("ST6OTHER", 0)
    expect(result).toEqual({ error: 100 })
  })
})
