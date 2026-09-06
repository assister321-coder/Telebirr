package com.telebirr.superapp.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.telebirr.superapp.R
import com.telebirr.superapp.ui.adapters.ServiceAdapter
import com.telebirr.superapp.ui.adapters.TransactionAdapter
import com.telebirr.superapp.viewmodel.AppViewModel

class HomeFragment : Fragment() {

    private lateinit var viewModel: AppViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_home, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = ViewModelProvider(requireActivity())[AppViewModel::class.java]

        val tvGreeting = view.findViewById<TextView>(R.id.tvGreeting)
        val tvBalance = view.findViewById<TextView>(R.id.tvBalance)
        val tvSavings = view.findViewById<TextView>(R.id.tvSavings)
        val tvRewards = view.findViewById<TextView>(R.id.tvRewards)
        val btnToggleBalance = view.findViewById<ImageButton>(R.id.btnToggleBalance)
        val rvServices = view.findViewById<RecyclerView>(R.id.rvServices)
        val rvRecentTransactions = view.findViewById<RecyclerView>(R.id.rvRecentTransactions)

        // Set greeting based on time
        val hour = java.util.Calendar.getInstance().get(java.util.Calendar.HOUR_OF_DAY)
        val greeting = when {
            hour < 12 -> getString(R.string.greet_morning)
            hour < 18 -> getString(R.string.greet_afternoon)
            else -> getString(R.string.greet_evening)
        }

        viewModel.userName.observe(viewLifecycleOwner) { name ->
            val firstName = name.split(" ").first()
            tvGreeting.text = "$greeting, $firstName"
        }

        viewModel.balance.observe(viewLifecycleOwner) { bal ->
            tvBalance.text = String.format("%,.2f", bal)
        }

        viewModel.balanceHidden.observe(viewLifecycleOwner) { hidden ->
            tvBalance.text = if (hidden) "••••••" else String.format("%,.2f", viewModel.balance.value ?: 0.0)
        }

        btnToggleBalance.setOnClickListener {
            viewModel.toggleBalanceHidden()
        }

        tvSavings.text = "1,050.00"
        tvRewards.text = "18.40"

        // Services grid
        rvServices.layoutManager = GridLayoutManager(context, 4)
        rvServices.adapter = ServiceAdapter { service ->
            // Handle service click - navigate to appropriate screen
            when (service) {
                "send" -> { /* Navigate to send */ }
                "cash_in_out" -> { /* Navigate to receive */ }
                "airtime" -> { /* Navigate to airtime */ }
                "marketplace" -> { /* Show toast */ }
                "bank" -> { /* Navigate to bank */ }
            }
        }

        // Recent transactions
        rvRecentTransactions.layoutManager = LinearLayoutManager(context)
        viewModel.transactions.observe(viewLifecycleOwner) { txs ->
            rvRecentTransactions.adapter = TransactionAdapter(txs.take(5))
        }
    }
}
