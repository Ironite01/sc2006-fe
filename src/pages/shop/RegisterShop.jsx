import { useEffect, useState } from "react";
import "./../campaign/components/CampaignForm.css"; // reuse styling
import SubmitButton from "../../components/SubmitButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import getUser from "../../helpers/getUser";
import { USER_ROLES } from "../../helpers/constants";
import { shop } from "../../../paths";

export default function RegisterShop() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    tag: "",
    businessRepresentative: "",
    imageUrl: "",
  });

  useEffect(() => {
    authorizeAndCheckShop();
  }, []);

  async function authorizeAndCheckShop() {
    const user = await getUser();

    if (!user || user?.role !== USER_ROLES.BUSINESS_REPRESENTATIVE) {
      toast.error("This page is only for business representatives!");
      navigate("/");
      return;
    }

    // If they already have a shop, send them straight to campaigns
    try {
      const res = await fetch(shop.me, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.shop?.shopId) {
          navigate("/campaign", { replace: true });
        }
      }
      // 404 = no shop yet -> stay on this page
    } catch (e) {
      console.error("Failed to check shop:", e);
    }


  }

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const errors = [];

    if (!formData.name.trim()) errors.push("Please enter your shop name.");
    if (!formData.description.trim())
      errors.push("Please enter a short shop description.");
    if (!formData.location.trim())
      errors.push("Please enter your shop location.");
    if (!formData.businessRepresentative.trim())
      errors.push("Please enter the business representative name.");

    errors.forEach((msg) => toast.error(msg));

    return errors.length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(shop.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          location: formData.location,
          tag: formData.tag || null,
          imageUrl: formData.imageUrl || null,
          progress: 0,
          businessRepresentative: formData.businessRepresentative,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to create shop");
      }

      toast.success("Shop registered! You can now create campaigns.");
      navigate("/campaign", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong creating the shop.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="campaign-form-container">
      <h1 className="form-title">Register Your Shop</h1>

      <form onSubmit={handleSubmit} className="campaign-form">
        {/* Shop Name */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name of Shop*
          </label>
          <input
            id="name"
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Tiong Bahru Artisan Bakery"
          />
          <div className="field-info">What is your shop called?</div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Shop Description*
          </label>
          <textarea
            id="description"
            className="form-textarea"
            rows="4"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Tell supporters about your shop."
          />
          <div className="field-info">
            Short description (what you sell, vibe, etc.).
          </div>
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Location*
          </label>
          <input
            id="location"
            type="text"
            className="form-input"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="e.g. Tiong Bahru, Toa Payoh"
          />
          <div className="field-info">Where is your shop located?</div>
        </div>

        {/* Tag */}
        <div className="form-group">
          <label htmlFor="tag" className="form-label">
            Tag / Category
          </label>
          <input
            id="tag"
            type="text"
            className="form-input"
            value={formData.tag}
            onChange={(e) => handleChange("tag", e.target.value)}
            placeholder="e.g. Cafe, Hawker, Local, Chinese, Beverage"
          />
          <div className="field-info">
            Optional category to help users find you.
          </div>
        </div>

        {/* Business Representative */}
        <div className="form-group">
          <label htmlFor="businessRepresentative" className="form-label">
            Business Representative Name*
          </label>
          <input
            id="businessRepresentative"
            type="text"
            className="form-input"
            value={formData.businessRepresentative}
            onChange={(e) =>
              handleChange("businessRepresentative", e.target.value)
            }
            placeholder="Person in charge for this shop"
          />
        </div>

        {/* Image URL */}
        <div className="form-group">
          <label htmlFor="imageUrl" className="form-label">
            Shop Image URL
          </label>
          <input
            id="imageUrl"
            type="text"
            className="form-input"
            value={formData.imageUrl}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
            placeholder="Optional image link (e.g. https://...)"
          />
          <div className="field-info">
            Optional – paste an image URL if you have one.
          </div>
        </div>

        <div className="form-actions">
          <SubmitButton
            type="submit"
            loading={loading}
            className="create-btn bg-[#00bf63] hover:bg-[#00a856]"
          >
            Create Shop
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
