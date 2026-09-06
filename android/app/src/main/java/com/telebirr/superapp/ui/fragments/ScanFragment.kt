package com.telebirr.superapp.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.telebirr.superapp.R

class ScanFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_scan, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        view.findViewById<View>(R.id.btnManualPay)?.setOnClickListener {
            val etCode = view.findViewById<EditText>(R.id.etMerchantCode)
            val code = etCode.text.toString().trim()
            if (code.isEmpty()) {
                Toast.makeText(context, R.string.err_field, Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            Toast.makeText(context, R.string.scan_pay, Toast.LENGTH_SHORT).show()
        }
    }
}
