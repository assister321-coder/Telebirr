package com.telebirr.superapp.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.chip.ChipGroup
import com.telebirr.superapp.R
import com.telebirr.superapp.ui.adapters.TransactionAdapter
import com.telebirr.superapp.viewmodel.AppViewModel

class TransactionsFragment : Fragment() {

    private lateinit var viewModel: AppViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_transactions, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = ViewModelProvider(requireActivity())[AppViewModel::class.java]

        val rvTransactions = view.findViewById<RecyclerView>(R.id.rvTransactions)
        val chipGroup = view.findViewById<ChipGroup>(R.id.chipGroupFilter)

        rvTransactions.layoutManager = LinearLayoutManager(context)

        viewModel.transactions.observe(viewLifecycleOwner) { txs ->
            rvTransactions.adapter = TransactionAdapter(txs)
        }

        chipGroup.setOnCheckedStateChangeListener { _, checkedIds ->
            // Filter transactions based on selected chip
            // For now, show all
            viewModel.transactions.observe(viewLifecycleOwner) { txs ->
                val filtered = when (checkedIds.firstOrNull()) {
                    R.id.chipSent -> txs.filter { it.amount < 0 }
                    R.id.chipReceived -> txs.filter { it.amount > 0 }
                    R.id.chipBills -> txs.filter { it.kind.name == "BILL" || it.kind.name == "AIRTIME" }
                    else -> txs
                }
                rvTransactions.adapter = TransactionAdapter(filtered)
            }
        }
    }
}
