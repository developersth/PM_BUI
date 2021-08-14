'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      DocNo: {
        type: Sequelize.STRING(50)
      },
      DocDate: {
        type: Sequelize.DATE
      },
      Status: {
        type: Sequelize.STRING(50)
      },
      PoNo: {
        type: Sequelize.STRING(20)
      },
      PoFileName: {
        type: Sequelize.STRING(100)
      },
      PoFile: {
        type: Sequelize.STRING(100)
      },
      itemPR: {
        type: Sequelize.JSON
      },
      ProductValue: {
        type: Sequelize.DECIMAL(15,2)
      },
      Currency: {
        type: Sequelize.STRING(10)
      },
      Buyer: {
        type: Sequelize.STRING(30)
      },
      Supplier: {
        type: Sequelize.STRING(50)
      },
      Details: {
        type: Sequelize.STRING
      },
      PaymentTerm: {
        type: Sequelize.STRING(100)
      },
      DeliveryTerm: {
        type: Sequelize.STRING(100)
      },
      Remarks: {
        type: Sequelize.STRING
      },
      OrderAckFileName: {
        type: Sequelize.STRING(100)
      },
      OrderAckFile: {
        type: Sequelize.STRING(100)
      },
      DeliveryDate: {
        type: Sequelize.DATE
      },
      InvoiceNo: {
        type: Sequelize.STRING(50)
      },
      InvoiceFileName: {
        type: Sequelize.STRING(100)
      },
      InvoiceFile: {
        type: Sequelize.STRING(100)
      },
      PackingListNo: {
        type: Sequelize.STRING(50)
      },
      PackingListFileName: {
        type: Sequelize.STRING(100)
      },
      PackingListFile: {
        type: Sequelize.STRING(100)
      },
      FreightForworder: {
        type: Sequelize.STRING(50)
      },
      BillOfLadingNo: {
        type: Sequelize.STRING(50)
      },
      BillOfLadingFileName: {
        type: Sequelize.STRING(100)
      },
      BillOfLadingFile: {
        type: Sequelize.STRING(100)
      },
      AirWayBillNo: {
        type: Sequelize.STRING(50)
      },
      AirWayBillFileName: {
        type: Sequelize.STRING(100)
      },
      AirWayBillFile: {
        type: Sequelize.STRING(100)
      },
      TaxInvoiceNo: {
        type: Sequelize.STRING(50)
      },
      TaxInvoiceFileName: {
        type: Sequelize.STRING(100)
      },
      TaxInvoiceFile: {
        type: Sequelize.STRING(100)
      },
      TaxValue: {
        type: Sequelize.DECIMAL(15,2)
      },
      FreightInvoiceNo: {
        type: Sequelize.STRING(50)
      },
      FreightInvoiceFileName: {
        type: Sequelize.STRING(100)
      },
      FreightInvoiceFile: {
        type: Sequelize.STRING(100)
      },
      FreightInvoiceValue: {
        type: Sequelize.DECIMAL(15,2)
      },
      DeliveryNoticeFile: {
        type: Sequelize.STRING(100)
      },
      createBy: {
        type: Sequelize.STRING(30)
      },
      updateBy: {
        type: Sequelize.STRING(30)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Documents');
  }
};