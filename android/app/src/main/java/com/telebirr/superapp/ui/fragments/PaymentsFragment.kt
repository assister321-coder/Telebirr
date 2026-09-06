package com.telebirr.superapp.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.telebirr.superapp.R
import com.telebirr.superapp.data.MockData
import com.telebirr.superapp.ui.adapters.BeneficiaryAdapter

class PaymentsFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_payments, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val rvBeneficiaries = view.findViewById<RecyclerView>(R.id.rvBeneficiaries)
        rvBeneficiaries.layoutManager = LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
        rvBeneficiaries.adapter = BeneficiaryAdapter(MockData.CONTACTS.take(8))

        // Click listeners
        view.findViewById<View>(R.id.paySend)?.setOnClickListener {
            Toast.makeText(context, R.string.send_title, Toast.LENGTH_SHORT).show()
        }
        view.findViewById<View>(R.id.payReceive)?.setOnClickListener {
            Toast.makeText(context, R.string.recv_title, Toast.LENGTH_SHORT).show()
        }
        view.findViewById<View>(R.id.payQr)?.setOnClickListener {
            Toast.makeText(context, R.string.scan_title, Toast.LENGTH_SHORT).show()
        }
        view.findViewById<View>(R.id.payAirtime)?.setOnClickListener {
            Toast.makeText(context, R.string.airtime_title, Toast.LENGTH_SHORT).show()
        }
        view.findViewById<View>(R.id.payBills)?.setOnClickListener {
            Toast.makeText(context, R.string.bills_title, Toast.LENGTH_SHORT).show()
        }
        view.findViewById<View>(R.id.payBank)?.setOnClickListener {
            Toast.makeText(context, R.string.bank_title, Toast.LENGTH_SHORT).show()
        }
    }
}
