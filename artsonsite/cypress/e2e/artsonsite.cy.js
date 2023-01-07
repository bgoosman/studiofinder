describe('template spec', () => {
  it('passes', () => {
    cy.setCookie('__cflb', '0pg1RBqXRkNWfUyKK29kXckT2iyJBQKhJrwe8dch')
    cy.setCookie('__cf_bm', 'n7G_yd9KA3MugAP3azI2E.dgVPIXpJdDnS7CizKloEM-1673041187-0-AXf+2oAcgxDmefP2BRutGm4JILUUdvCV8zgZbPW00DMFDmVbeAxmAb3MjOkS7feLjx9bB4DzCdt2aVJsu/pRi1peHMMh3XeyKVqMyKuOiJ+D')
    cy.setCookie('__cfruid', '958dbc1243d85332387a932224d1c724b1edb603-1673041187')
    cy.setCookie('ASP.NET_SessionId', 'wgoibqop54ivj5ed2l0nb2ci')
    cy.setCookie('SessionFarm%5FGUID', '{57D23162-F8FF-43FA-AC96-5B3447F02BFE}')
    cy.visit('https://clients.mindbodyonline.com/ASP/main_appts.asp?studioid=902522')
  })
})