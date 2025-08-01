;; Deploys and manages outcome-based impact bond campaigns

(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-NOT-FOUND u101)
(define-constant ERR-ZERO-ADDRESS u102)
(define-constant ERR-ALREADY-REGISTERED u103)

;; Admin control
(define-data-var admin principal tx-sender)

;; Campaign structure
(define-map bond-registry uint
  {
    ngo: principal,
    verifier: principal,
    title: (string-ascii 64),
    goal: uint,
    funded: uint,
    is-funded: bool,
    verified: bool,
    active: bool
  }
)

(define-data-var bond-counter uint u0)

;; Check admin privilege
(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

;; Transfer admin
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (not (is-eq new-admin 'SP000000000000000000002Q6VF78)) (err ERR-ZERO-ADDRESS))
    (var-set admin new-admin)
    (ok true)
  )
)

;; Launch new bond
(define-public (create-bond (title (string-ascii 64)) (goal uint) (verifier principal))
  (let ((bond-id (var-get bond-counter)))
    (begin
      (asserts! (not (is-eq verifier 'SP000000000000000000002Q6VF78)) (err ERR-ZERO-ADDRESS))
      (map-set bond-registry bond-id {
        ngo: tx-sender,
        verifier: verifier,
        title: title,
        goal: goal,
        funded: u0,
        is-funded: false,
        verified: false,
        active: true
      })
      (var-set bond-counter (+ bond-id u1))
      (ok bond-id)
    )
  )
)

;; Fund bond
(define-public (fund-bond (bond-id uint) (amount uint))
  (let (
    (bond (map-get? bond-registry bond-id))
  )
    (match bond
      entry
        (begin
          (asserts! (get active entry) (err ERR-NOT-FOUND))
          (let ((new-funded (+ (get funded entry) amount)))
            (map-set bond-registry bond-id (merge entry {
              funded: new-funded,
              is-funded: (>= new-funded (get goal entry))
            }))
            (ok true)
          )
        )
      (err ERR-NOT-FOUND)
    )
  )
)

;; Mark bond as verified (called by assigned verifier)
(define-public (verify-bond (bond-id uint))
  (let (
    (bond (map-get? bond-registry bond-id))
  )
    (match bond
      entry
        (begin
          (asserts! (is-eq tx-sender (get verifier entry)) (err ERR-NOT-AUTHORIZED))
          (map-set bond-registry bond-id (merge entry {
            verified: true,
            active: false
          }))
          (ok true)
        )
      (err ERR-NOT-FOUND)
    )
  )
)

;; Read-only: get bond details
(define-read-only (get-bond (bond-id uint))
  (match (map-get? bond-registry bond-id)
    bond (ok bond)
    (err ERR-NOT-FOUND)
  )
)

;; Read-only: total campaigns
(define-read-only (get-total-bonds)
  (ok (var-get bond-counter))
)

;; Read-only: get admin
(define-read-only (get-admin)
  (ok (var-get admin))
)
