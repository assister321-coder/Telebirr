package com.telebirr.superapp.ui.activities

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.widget.addTextChangedListener
import com.google.android.material.button.MaterialButton
import com.telebirr.superapp.R

class LoginActivity : AppCompatActivity() {

    companion object {
        const val DEMO_PIN = "797970"
    }

    private var step = "phone"
    private var phone = "956797970"
    private var pin = ""

    private lateinit var phoneSection: LinearLayout
    private lateinit var pinSection: LinearLayout
    private lateinit var etPhone: EditText
    private lateinit var tvPhoneError: TextView
    private lateinit var tvStepTitle1: TextView
    private lateinit var tvStepTitle2: TextView
    private lateinit var tvStepTitle3: TextView
    private lateinit var tvPinSub: TextView
    private lateinit var pinDotsContainer: LinearLayout
    private lateinit var numberPad: android.widget.GridLayout
    private lateinit var btnNext: MaterialButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        phoneSection = findViewById(R.id.phoneSection)
        pinSection = findViewById(R.id.pinSection)
        etPhone = findViewById(R.id.etPhone)
        tvPhoneError = findViewById(R.id.tvPhoneError)
        tvStepTitle1 = findViewById(R.id.tvStepTitle1)
        tvStepTitle2 = findViewById(R.id.tvStepTitle2)
        tvStepTitle3 = findViewById(R.id.tvStepTitle3)
        tvPinSub = findViewById(R.id.tvPinSub)
        pinDotsContainer = findViewById(R.id.pinDotsContainer)
        numberPad = findViewById(R.id.numberPad)
        btnNext = findViewById(R.id.btnNext)

        etPhone.setText(phone)
        etPhone.addTextChangedListener { text ->
            phone = text?.toString()?.replace("\\D".toRegex(), "") ?: ""
        }

        btnNext.setOnClickListener {
            if (phone.length != 9 || !phone.startsWith("9")) {
                tvPhoneError.visibility = View.VISIBLE
                return@setOnClickListener
            }
            tvPhoneError.visibility = View.GONE
            showPinScreen()
        }

        setupNumberPad()
    }

    private fun showPinScreen() {
        step = "pin"
        phoneSection.visibility = View.GONE
        pinSection.visibility = View.VISIBLE

        tvStepTitle1.visibility = View.GONE
        tvStepTitle2.visibility = View.GONE
        tvStepTitle3.setText(R.string.login_enter_pin)

        val formatted = "+251 ${phone.slice(0..2)} ${phone.slice(3..5)} ${phone.slice(6..8)}"
        tvPinSub.text = "${getString(R.string.login_pin_sub)} $formatted"

        updatePinDots()
    }

    private fun setupNumberPad() {
        val numbers = listOf("1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫")

        for (num in numbers) {
            val btn = TextView(this).apply {
                text = num
                textSize = 27f
                setPadding(0, 48, 0, 48)
                gravity = android.view.Gravity.CENTER
                isClickable = num.isNotEmpty()
                isFocusable = num.isNotEmpty()
                if (num.isNotEmpty()) {
                    setBackgroundResource(android.R.drawable.list_selector_background)
                    setOnClickListener {
                        when (num) {
                            "⌫" -> {
                                if (pin.isNotEmpty()) {
                                    pin = pin.dropLast(1)
                                    updatePinDots()
                                }
                            }
                            else -> {
                                if (pin.length < 6) {
                                    pin += num
                                    updatePinDots()
                                    if (pin.length == 6) {
                                        Handler(Looper.getMainLooper()).postDelayed({
                                            submitPin()
                                        }, 120)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            numberPad.addView(btn)
        }
    }

    private fun updatePinDots() {
        pinDotsContainer.removeAllViews()
        for (i in 0 until 6) {
            val dot = View(this).apply {
                val size = resources.getDimensionPixelSize(R.dimen.spacing_md)
                layoutParams = LinearLayout.LayoutParams(size, size).apply {
                    marginStart = resources.getDimensionPixelSize(R.dimen.spacing_sm)
                    marginEnd = resources.getDimensionPixelSize(R.dimen.spacing_sm)
                }
                background = if (i < pin.length) {
                    getDrawable(R.drawable.bg_circle_green)
                } else {
                    getDrawable(R.drawable.bg_circle_orange)?.apply {
                        setTint(getColor(R.color.divider))
                    }
                }
            }
            pinDotsContainer.addView(dot)
        }
    }

    private fun submitPin() {
        if (pin.length != 6) {
            Toast.makeText(this, R.string.err_pin, Toast.LENGTH_SHORT).show()
            return
        }
        if (pin != DEMO_PIN) {
            Toast.makeText(this, R.string.err_pin_wrong, Toast.LENGTH_SHORT).show()
            pin = ""
            updatePinDots()
            return
        }

        val formatted = "+251 ${phone.slice(0..2)} ${phone.slice(3..5)} ${phone.slice(6..8)}"
        Toast.makeText(this, R.string.login_toast, Toast.LENGTH_SHORT).show()

        val intent = Intent(this, MainActivity::class.java).apply {
            putExtra("phone", formatted)
        }
        startActivity(intent)
        finish()
    }
}
