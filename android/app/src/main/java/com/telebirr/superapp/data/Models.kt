package com.telebirr.superapp.data

data class Transaction(
    val id: String,
    val kind: TxKind,
    val title: String,
    val phone: String? = null,
    val amount: Double,
    val fee: Double = 0.0,
    val ts: Long,
    val status: String = "Completed",
    val method: String = "Wallet",
    val refId: String? = null,
    val note: String? = null
)

enum class TxKind { SENT, RECEIVED, BILL, AIRTIME, BANK, MERCHANT }

data class Contact(
    val name: String,
    val phone: String
)

data class BankInfo(
    val code: String,
    val name: String,
    val color: Int
)

data class Notification(
    val id: String,
    val tone: String,
    val ago: String,
    val titleEn: String,
    val bodyEn: String,
    val titleAm: String,
    val bodyAm: String
)
