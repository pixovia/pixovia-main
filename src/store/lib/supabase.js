import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export const appsService = {
  async getApps(category = null, search = null) {
    let query = supabase
      .from('apps')
      .select('*')
      .order('created_at', { ascending: false })

    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getApp(id) {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async addApp(appData) {
    const { data, error } = await supabase
      .from('apps')
      .insert([appData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateApp(id, updates) {
    const { data, error } = await supabase
      .from('apps')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteApp(id) {
    const { data, error } = await supabase
      .from('apps')
      .delete()
      .eq('id', id)

    if (error) throw error
    return data
  },

  async incrementDownload(id) {
    try {
      const { data, error } = await supabase
        .from('apps')
        .update({ downloads: supabase.raw('downloads + 1') })
        .eq('id', String(id))
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error incrementing downloads:', error)
      return null
    }
  },

  async addReview(appId, rating, reviewText, userName, platform = 'Windows') {
    const userIp = await fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => data.ip)
      .catch(() => 'unknown')

    const { data, error } = await supabase
      .from('reviews')
      .upsert({
        app_id: appId,
        user_ip: userIp,
        user_name: userName,
        rating: rating,
        review_text: reviewText,
        platform: platform
      })

    if (error) throw error
    return data
  },

  async getReviews(appId, platform = null) {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        review_replies(*),
        review_likes(*)
      `)
      .eq('app_id', appId)
      .order('created_at', { ascending: false })

    if (platform) {
      query = query.eq('platform', platform)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async addReply(reviewId, replyText, userName) {
    const userIp = await fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => data.ip)
      .catch(() => 'unknown')

    const { data, error } = await supabase
      .from('review_replies')
      .insert({
        review_id: reviewId,
        user_ip: userIp,
        user_name: userName,
        reply_text: replyText
      })

    if (error) throw error
    return data
  },

  async toggleLike(reviewId, isLike) {
    const userIp = await fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => data.ip)
      .catch(() => 'unknown')

    const { data, error } = await supabase
      .from('review_likes')
      .upsert({
        review_id: reviewId,
        user_ip: userIp,
        is_like: isLike
      })

    if (error) throw error
    return data
  },

  async addDownloadVariant(appId, variant) {
    const { data, error } = await supabase
      .from('download_variants')
      .insert({
        app_id: appId,
        ...variant
      })

    if (error) throw error
    return data
  },

  async getDeveloperApps(developerId) {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('developer_id', developerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getDeveloper(id) {
    const { data, error } = await supabase
      .from('developers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getDevelopers() {
    const { data, error } = await supabase
      .from('developers')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  },

  async getHeroBanners() {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (error) throw error
    return data
  },

  async getCollections(type = null) {
    let query = supabase
      .from('collections')
      .select(`
        *,
        collection_items(
          *,
          apps(*)
        )
      `)
      .eq('is_active', true)
      .order('display_order')

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async addBanner(bannerData) {
    const { data, error } = await supabase
      .from('hero_banners')
      .insert([bannerData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateBanner(id, updates) {
    const { data, error } = await supabase
      .from('hero_banners')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteBanner(id) {
    const { data, error } = await supabase
      .from('hero_banners')
      .delete()
      .eq('id', id)

    if (error) throw error
    return data
  },

  async getBanners() {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('display_order')

    if (error) throw error
    return data
  },

  async createBanner(bannerData) {
    const { data, error } = await supabase
      .from('hero_banners')
      .insert([bannerData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async createApp(appData) {
    const { data, error } = await supabase
      .from('apps')
      .insert([appData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async createCollection(collectionData) {
    const { data, error } = await supabase
      .from('collections')
      .insert([collectionData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateCollection(id, updates) {
    const { data, error } = await supabase
      .from('collections')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getAllCollections() {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('display_order')

    if (error) throw error
    return data
  }
}