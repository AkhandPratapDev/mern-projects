import policiesModel from "../models/policiesModel.js";

// Get policies
export const getPolicies = async (req, res) => {
  try {
    const policies = await policiesModel.findOne(); // only one document expected
    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update policies
export const updatePolicies = async (req, res) => {
  try {
    const { shipping_policy, returns_policy, privacy_policy } = req.body;

    let policies = await policiesModel.findOne();
    if (!policies) {
      policies = new policiesModel({
        shipping_policy,
        returns_policy,
        privacy_policy,
      });
    } else {
      if (shipping_policy !== undefined)
        policies.shipping_policy = shipping_policy;
      if (returns_policy !== undefined)
        policies.returns_policy = returns_policy;
      if (privacy_policy !== undefined)
        policies.privacy_policy = privacy_policy;
    }

    const updated = await policies.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
