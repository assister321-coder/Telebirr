package com.telebirr.superapp.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.telebirr.superapp.R
import com.telebirr.superapp.viewmodel.AppViewModel

class ProfileFragment : Fragment() {

    private lateinit var viewModel: AppViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_profile, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = ViewModelProvider(requireActivity())[AppViewModel::class.java]

        val tvUserName = view.findViewById<TextView>(R.id.tvUserName)
        val tvUserPhone = view.findViewById<TextView>(R.id.tvUserPhone)

        viewModel.userName.observe(viewLifecycleOwner) { name ->
            tvUserName.text = name
        }

        viewModel.userPhone.observe(viewLifecycleOwner) { phone ->
            tvUserPhone.text = phone
        }

        // Menu click listeners
        view.findViewById<View>(R.id.menuPersonal)?.setOnClickListener {
            Toast.makeText(context, R.string.demo_feature, Toast.LENGTH_SHORT).show()
        }
        view.findViewById<View>(R.id.menuSecurity)?.setOnClickListener {
            Toast.makeText(context, R.string.demo_feature, Toast.LENGTH_SHORT).show()
        }
        view.findViewById<View>(R.id.menuLinked)?.setOnClickListener {
            Toast.makeText(context, R.string.demo_feature, Toast.LENGTH_SHORT).show()
        }
        view.findViewById<View>(R.id.menuBeneficiaries)?.setOnClickListener {
            Toast.makeText(context, R.string.demo_feature, Toast.LENGTH_SHORT).show()
        }
        view.findViewById<View>(R.id.menuLanguage)?.setOnClickListener {
            Toast.makeText(context, R.string.demo_feature, Toast.LENGTH_SHORT).show()
        }
        view.findViewById<View>(R.id.menuNotifications)?.setOnClickListener {
            Toast.makeText(context, R.string.demo_feature, Toast.LENGTH_SHORT).show()
        }
        view.findViewById<View>(R.id.menuHelp)?.setOnClickListener {
            Toast.makeText(context, R.string.demo_feature, Toast.LENGTH_SHORT).show()
        }
        view.findViewById<View>(R.id.menuAbout)?.setOnClickListener {
            Toast.makeText(context, R.string.demo_feature, Toast.LENGTH_SHORT).show()
        }
        view.findViewById<View>(R.id.menuSignOut)?.setOnClickListener {
            requireActivity().finish()
        }
    }
}
