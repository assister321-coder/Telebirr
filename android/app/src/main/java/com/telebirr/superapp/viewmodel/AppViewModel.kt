package com.telebirr.superapp.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.telebirr.superapp.data.MockData
import com.telebirr.superapp.data.Transaction
import com.telebirr.superapp.data.TxKind
import kotlin.math.abs

class AppViewModel : ViewModel() {

    private val _balance = MutableLiveData(794.0)
    val balance: LiveData<Double> = _balance

    private val _balanceHidden = MutableLiveData(false)
    val balanceHidden: LiveData<Boolean> = _balanceHidden

    private val _transactions = MutableLiveData<MutableList<Transaction>>(MockData.buildInitialTransactions())
    val transactions: LiveData<MutableList<Transaction>> = _transactions

    private val _userName = MutableLiveData("Nebiyou Demo")
    val userName: LiveData<String> = _userName

    private val _userPhone = MutableLiveData("+251 911 223 344")
    val userPhone: LiveData<String> = _userPhone

    private val _lang = MutableLiveData("en")
    val lang: LiveData<String> = _lang

    fun toggleBalanceHidden() {
        _balanceHidden.value = !(_balanceHidden.value ?: false)
    }

    fun setLang(language: String) {
        _lang.value = language
    }

    fun addMoney(amount: Double): Boolean {
        if (amount <= 0) return false
        _balance.value = (_balance.value ?: 0.0) + amount
        return true
    }

    fun commitTransaction(
        type: TxKind,
        title: String,
        phone: String? = null,
        amount: Double,
        note: String? = null,
        method: String = "Wallet"
    ): Transaction {
        val neg = type in listOf(TxKind.SENT, TxKind.BILL, TxKind.AIRTIME, TxKind.BANK, TxKind.MERCHANT)
        val fee = if (neg) serviceFee(abs(amount)) else 0.0
        val signedAmount = if (neg) -abs(amount) else abs(amount)

        val alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        val id = (1..10).map { alphabet.random() }.joinToString("")

        val tx = Transaction(
            id = id,
            kind = type,
            title = title,
            phone = phone,
            amount = signedAmount,
            fee = fee,
            ts = System.currentTimeMillis(),
            status = "Completed",
            method = method,
            note = note
        )

        _transactions.value?.add(0, tx)
        _transactions.notifyObservers()
        _balance.value = (_balance.value ?: 0.0) + signedAmount - fee

        return tx
    }

    private fun serviceFee(amount: Double): Double {
        return when {
            amount <= 100 -> 0.0
            amount <= 500 -> amount * 0.01
            amount <= 1000 -> amount * 0.015
            else -> amount * 0.02
        }
    }

    fun login(phone: String) {
        _userPhone.value = phone
    }

    private fun <T> MutableLiveData<T>.notifyObservers() {
        value = value
    }
}
