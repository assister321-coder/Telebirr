package com.telebirr.superapp.data

object MockData {

    fun buildInitialTransactions(): MutableList<Transaction> {
        return mutableListOf(
            Transaction("DEMO-849203", TxKind.SENT, "Abebe Kebede", "+251 911 204 482", -500.0, ts = System.currentTimeMillis() - 3600000, method = "Wallet"),
            Transaction("DEMO-847719", TxKind.RECEIVED, "Hana Ali", "+251 912 845 117", 1200.0, ts = System.currentTimeMillis() - 7200000, method = "Wallet"),
            Transaction("DEMO-845510", TxKind.AIRTIME, "Ethio Telecom", "+251 911 223 344", -100.0, ts = System.currentTimeMillis() - 86400000, method = "Wallet"),
            Transaction("DEMO-844002", TxKind.MERCHANT, "Buna Bet Coffee", "+251 920 334 010", -120.0, ts = System.currentTimeMillis() - 172800000, method = "QR Pay"),
            Transaction("DEMO-839954", TxKind.BILL, "EEPCO Utility", amount = -430.0, ts = System.currentTimeMillis() - 259200000, refId = "electricity", note = "Meter 042-118-77"),
            Transaction("DEMO-837431", TxKind.RECEIVED, "Meron Tadesse", "+251 913 552 906", 950.0, ts = System.currentTimeMillis() - 345600000, method = "Wallet"),
            Transaction("DEMO-831208", TxKind.BANK, "Awash Bank", amount = -2000.0, ts = System.currentTimeMillis() - 432000000, method = "Wallet"),
            Transaction("DEMO-829346", TxKind.SENT, "Dawit Haile", "+251 920 118 340", -300.0, ts = System.currentTimeMillis() - 518400000, note = "Dinner split"),
            Transaction("DEMO-821550", TxKind.RECEIVED, "Acme Trading PLC", "+251 911 600 002", 18500.0, ts = System.currentTimeMillis() - 604800000, method = "Bank", note = "Invoice #1042"),
            Transaction("DEMO-818873", TxKind.BILL, "WebSprix", amount = -999.0, ts = System.currentTimeMillis() - 691200000, refId = "internet"),
            Transaction("DEMO-815504", TxKind.RECEIVED, "Tigist Alemu", "+251 911 980 112", 450.0, ts = System.currentTimeMillis() - 777600000, method = "Wallet"),
            Transaction("DEMO-810092", TxKind.BILL, "Addis Water & Sewerage", amount = -260.0, ts = System.currentTimeMillis() - 864000000, refId = "water")
        )
    }

    val CONTACTS = listOf(
        Contact("Abebe Kebede", "+251 911 204 482"),
        Contact("Hana Ali", "+251 912 845 117"),
        Contact("Meron Tadesse", "+251 913 552 906"),
        Contact("Dawit Haile", "+251 920 118 340"),
        Contact("Selam Bekele", "+251 911 673 255"),
        Contact("Yonas Girma", "+251 913 044 821"),
        Contact("Tigist Alemu", "+251 911 980 112"),
        Contact("Kalkidan Assefa", "+251 920 555 768")
    )

    val AIRTIME_AMOUNTS = listOf(50, 100, 200, 500, 1000)

    val BILL_CATS = listOf("electricity", "water", "internet", "tv", "telephone", "other")

    val BANKS = listOf(
        BankInfo("CBE", "Commercial Bank of Ethiopia", 0xFF7C5CE0.toInt()),
        BankInfo("AWB", "Awash Bank", 0xFFD98A00.toInt()),
        BankInfo("DSH", "Dashen Bank", 0xFF2B7CD3.toInt()),
        BankInfo("BOA", "Bank of Abyssinia", 0xFF0E9488.toInt()),
        BankInfo("ZMN", "Zemen Bank", 0xFFC24E7E.toInt()),
        BankInfo("AMB", "Amhara Bank", 0xFFB8541D.toInt())
    )

    val NOTIFICATIONS = listOf(
        Notification("n1", "brand", "2h", "Money received", "Hana Ali sent you ETB 1,200.00", "ገንዘብ ደርሶዎታል", "ሃና አሊ ETB 1,200.00 ልካለች"),
        Notification("n2", "warn", "1d", "Security tip", "Never share your PIN — even with support.", "የደህንነት ምክር", "ፒንዎን ከማንም ጋር አያጋሩ"),
        Notification("n3", "info", "3d", "Cashback weekend", "Earn 2% back on QR payments this weekend.", "የካሽባክ ቅናሽ", "በዚህ ቅዳሜና እሁድ በQR ክፍያ 2% ይመልሱ።")
    )
}
